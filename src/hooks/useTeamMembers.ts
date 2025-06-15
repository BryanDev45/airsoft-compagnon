
import { useTeamMembersFetch } from './team/useTeamMembersFetch';
import { useTeamMemberActions } from './team/useTeamMemberActions';
import { TeamData } from '@/types/team';

export const useTeamMembers = (
  team: TeamData, 
  user: any, 
  isTeamLeader: boolean, 
  onClose: () => void,
  onTeamUpdate?: () => void
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
    handleUpdateMemberAssociationRole,
    handleLeaveTeam
  } = useTeamMemberActions(
    team,
    user,
    isTeamLeader,
    onClose,
    setTeamMembers,
    setPendingMembers,
    fetchTeamMembers,
    onTeamUpdate
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
    handleUpdateMemberAssociationRole,
    handleLeaveTeam
  };
};
