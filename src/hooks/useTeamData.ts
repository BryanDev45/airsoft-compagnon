import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNetworkRequest } from './useNetworkRequest';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { TeamMember } from '@/types/team';

export const useTeamData = (teamId: string | undefined) => {
  const navigate = useNavigate();
  const [team, setTeam] = useState<any>(null);
  const [isTeamMember, setIsTeamMember] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const { loading, error, executeRequest } = useNetworkRequest({
    maxRetries: 3,
    initialDelay: 1000,
  });

  // Function to fetch team data
  const fetchTeamData = useCallback(async () => {
    if (!teamId) return;
    
    return executeRequest(async () => {
      // Fetch team data with separate queries to avoid relationship issues
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('*, team_fields(*)')
        .eq('id', teamId)
        .single();

      if (teamError) throw teamError;

      if (!teamData) {
        toast({
          title: "Équipe non trouvée",
          description: "Cette équipe n'existe pas ou a été supprimée",
          variant: "destructive",
        });
        navigate('/');
        return null;
      }

      // Get team members
      const { data: teamMembers, error: membersError } = await supabase
        .from('team_members')
        .select('id, role, user_id, status, game_role, association_role')
        .eq('team_id', teamData.id)
        .eq('status', 'confirmed');

      if (membersError) throw membersError;

      // Get profiles for team members
      let formattedMembers: any[] = [];
      let memberUserIds: string[] = [];
      
      if (teamMembers && teamMembers.length > 0) {
        const userIds = teamMembers.map(member => member.user_id).filter(Boolean);
        memberUserIds = [...userIds];
        
        if (userIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username, avatar, join_date, is_verified')
            .in('id', userIds);

          if (profilesError) throw profilesError;

          // Match profiles with team members and format the data
          formattedMembers = teamMembers.map(member => {
            const profile = profiles?.find(p => p.id === member.user_id);
            if (!profile) return null;
            
            return {
              id: profile.id,
              username: profile.username,
              role: member.role,
              game_role: member.game_role,
              association_role: member.association_role,
              avatar: profile.avatar,
              joinedTeam: profile.join_date ? new Date(profile.join_date).toLocaleDateString('fr-FR') : 'N/A',
              verified: profile.is_verified,
              isTeamLeader: member.user_id === teamData.leader_id,
              status: member.status
            };
          }).filter(Boolean);
        }
      }

      // Prepare empty arrays for games
      let upcomingGames = [];
      let pastGames = [];

      // Get games created by team members
      if (memberUserIds.length > 0) {
        try {
          // Get games with a try-catch to prevent failure if this part errors
          const { data: teamGames, error: gamesError } = await supabase
            .from('airsoft_games')
            .select('*')
            .in('created_by', memberUserIds)
            .order('date', { ascending: true });
  
          if (!gamesError && teamGames) {
            // Fetch creator usernames in a separate query
            const creatorIds = teamGames.map(game => game.created_by).filter(Boolean);
            const { data: creatorProfiles } = await supabase
              .from('profiles')
              .select('id, username')
              .in('id', creatorIds);
            
            // Attach creator info to games
            const gamesData = teamGames.map(game => {
              const creator = creatorProfiles?.find(profile => profile.id === game.created_by);
              return {
                ...game,
                creator: creator ? { username: creator.username } : null
              };
            });
  
            // Split games into upcoming and past
            const now = new Date();
            upcomingGames = (gamesData || [])
              .filter(game => new Date(game.date) > now)
              .map(game => ({
                id: game.id,
                title: game.title,
                date: new Date(game.date).toLocaleDateString('fr-FR'),
                location: game.city,
                participants: game.max_players || 0,
                creator: game.creator
              }));
  
            pastGames = (gamesData || [])
              .filter(game => new Date(game.date) <= now)
              .map(game => ({
                id: game.id,
                title: game.title,
                date: new Date(game.date).toLocaleDateString('fr-FR'),
                location: game.city,
                result: "Terminé", // Default status
                participants: game.max_players || 0,
                creator: game.creator
              }));
          }
        } catch (gameError) {
          console.error("Erreur lors de la récupération des parties:", gameError);
          // Don't fail the whole team loading just because games failed
        }
      }

      // Check if the current user is a member of this team
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const currentUserId = userData?.user?.id;
      setCurrentUserId(currentUserId);
      
      const isCurrentUserMember = currentUserId ? 
        formattedMembers.some(member => member.id === currentUserId) : 
        false;
        
      setIsTeamMember(isCurrentUserMember);

      const teamDataFormatted = {
        ...teamData,
        contactEmail: teamData.contact, 
        leader_id: teamData.leader_id,
        is_recruiting: teamData.is_recruiting,
        members: formattedMembers,
        upcomingGames,
        pastGames,
        field: teamData.team_fields?.[0] || null,
        stats: {
          gamesPlayed: pastGames.length + upcomingGames.length,
          memberCount: formattedMembers.length,
          averageRating: teamData.rating?.toFixed(1) || '0.0'
        }
      };

      setTeam(teamDataFormatted);
      return teamDataFormatted;
    }, {
      errorMessage: "Impossible de charger les données de l'équipe."
    });
  }, [teamId, navigate, executeRequest]);

  useEffect(() => {
    if (teamId) {
      fetchTeamData();
    }
  }, [teamId, fetchTeamData]);

  return {
    team,
    loading,
    error,
    isTeamMember,
    currentUserId,
    fetchTeamData,
  };
};
