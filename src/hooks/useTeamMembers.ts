import { useTeamMembersFetch } from './team/useTeamMembersFetch';
import { useTeamMemberActions } from './team/useTeamMemberActions';
import { TeamData } from '@/types/team';

export const useTeamMembers = (
  team: TeamData, 
  user: any, 
  isTeamLeader: boolean, 
  onClose: () => void
) => {
  const {
    teamMembers,
    setTeamMembers,
    pendingMembers,
    setPendingMembers,
    fetchTeamMembers
  } = useTeamMembersFetch(team);

  const {
    loading,
    setLoading,
    handleAcceptMember,
    handleRejectMember,
    handleRemoveMember,
    handleUpdateMemberRole,
    handleUpdateMemberGameRole,
    handleLeaveTeam
  } = useTeamMemberActions(
    team,
    user,
    isTeamLeader,
    onClose,
    setTeamMembers,
    setPendingMembers,
    fetchTeamMembers
  );

  return {
    teamMembers,
    pendingMembers,
    loading,
    setLoading,
    fetchTeamMembers,
    handleAcceptMember,
    handleRejectMember,
    handleRemoveMember,
    handleUpdateMemberRole,
    handleUpdateMemberGameRole,
    handleLeaveTeam
  };
};
