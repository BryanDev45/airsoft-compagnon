
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface TeamPermissions {
  canManageTeam: boolean;
  canAcceptMembers: boolean;
  canInviteMembers: boolean;
  canEditTeamInfo: boolean;
  isTeamLeader: boolean;
  isTeamAdmin: boolean;
  loading: boolean;
}

export const useTeamPermissions = (teamId: string | null) => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<TeamPermissions>({
    canManageTeam: false,
    canAcceptMembers: false,
    canInviteMembers: false,
    canEditTeamInfo: false,
    isTeamLeader: false,
    isTeamAdmin: false,
    loading: true,
  });

  useEffect(() => {
    const checkPermissions = async () => {
      if (!user || !teamId) {
        setPermissions(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        setPermissions(prev => ({ ...prev, loading: true }));

        // Vérifier si l'utilisateur est le leader de l'équipe
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .select('leader_id')
          .eq('id', teamId)
          .single();

        if (teamError) {
          console.error('Error fetching team data:', teamError);
          setPermissions(prev => ({ ...prev, loading: false }));
          return;
        }

        const isLeader = teamData?.leader_id === user.id;

        // Vérifier si l'utilisateur est membre de l'équipe et son rôle
        const { data: memberData, error: memberError } = await supabase
          .from('team_members')
          .select('role, status')
          .eq('team_id', teamId)
          .eq('user_id', user.id)
          .eq('status', 'confirmed')
          .single();

        const isTeamAdmin = memberData?.role === 'Admin' || memberData?.role === 'Administrateur';
        const isMember = !!memberData;

        // Définir les permissions
        const canManageTeam = isLeader || isTeamAdmin;
        const canAcceptMembers = isLeader || isTeamAdmin;
        const canInviteMembers = isLeader || isTeamAdmin;
        const canEditTeamInfo = isLeader; // Seul le leader peut modifier les infos de base

        setPermissions({
          canManageTeam,
          canAcceptMembers,
          canInviteMembers,
          canEditTeamInfo,
          isTeamLeader: isLeader,
          isTeamAdmin,
          loading: false,
        });

      } catch (error) {
        console.error('Error checking team permissions:', error);
        setPermissions(prev => ({ ...prev, loading: false }));
      }
    };

    checkPermissions();
  }, [user, teamId]);

  return permissions;
};
