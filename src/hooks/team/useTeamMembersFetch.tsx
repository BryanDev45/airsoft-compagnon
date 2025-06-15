
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { TeamData, TeamMember } from '@/types/team';

export const useTeamMembersFetch = (team: TeamData) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingMembers, setPendingMembers] = useState<TeamMember[]>([]);

  const fetchTeamMembers = async () => {
    if (!team?.id) return;
    
    try {
      console.log("Fetching team members for team:", team.id);
      
      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select('id, user_id, team_id, role, status, game_role, association_role')
        .eq('team_id', team.id);
        
      if (membersError) {
        console.error('Error fetching members:', membersError);
        toast({
          title: "Erreur",
          description: "Impossible de charger les membres de l'équipe: " + membersError.message,
          variant: "destructive"
        });
        return;
      }

      console.log("Team members data:", membersData);
      
      if (!Array.isArray(membersData) || membersData.length === 0) {
        console.log('No team members found');
        setTeamMembers([]);
        setPendingMembers([]);
        return;
      }
      
      const userIds = (membersData as TeamMember[]).map(member => member.user_id).filter(Boolean);
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar')
        .in('id', userIds);
        
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }
      
      const membersWithProfiles: TeamMember[] = (membersData as TeamMember[]).map(member => {
        const profile = profilesData?.find(p => p.id === member.user_id) || {
          id: member.user_id || '',
          username: 'Utilisateur',
          avatar: null
        };
        
        return {
          ...member,
          profiles: profile
        };
      });
      
      const confirmed = membersWithProfiles.filter(m => m.status === 'confirmed') || [];
      const pending = membersWithProfiles.filter(m => m.status === 'pending') || [];
      
      console.log("Confirmed members:", confirmed);
      console.log("Pending members:", pending);
      
      setTeamMembers(confirmed);
      setPendingMembers(pending);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des membres:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les membres de l'équipe: " + error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (team?.id) {
      fetchTeamMembers();
    }
  }, [team?.id]);

  return {
    teamMembers,
    setTeamMembers,
    pendingMembers,
    setPendingMembers,
    fetchTeamMembers
  };
};
