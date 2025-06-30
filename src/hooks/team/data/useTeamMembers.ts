
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTeamMembers = () => {
  const fetchTeamMembers = useCallback(async (teamId: string) => {
    // Get team members
    const { data: teamMembers, error: membersError } = await supabase
      .from('team_members')
      .select('id, role, user_id, status, game_role, association_role')
      .eq('team_id', teamId)
      .eq('status', 'confirmed');

    if (membersError) {
      console.error('Error fetching team members:', membersError);
      throw membersError;
    }

    console.log('Team members found:', teamMembers);

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

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          throw profilesError;
        }

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
            isTeamLeader: member.user_id === teamId,
            status: member.status
          };
        }).filter(Boolean);
      }
    }

    return { formattedMembers, memberUserIds };
  }, []);

  return { fetchTeamMembers };
};
