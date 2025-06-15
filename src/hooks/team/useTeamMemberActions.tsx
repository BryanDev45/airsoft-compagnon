
import { TeamData, TeamMember } from '@/types/team';
import { useTeamMemberAcceptance } from './actions/useTeamMemberAcceptance';
import { useTeamMemberManagement } from './actions/useTeamMemberManagement';
import { useTeamLeaving } from './actions/useTeamLeaving';

export const useTeamMemberActions = (
  team: TeamData,
  user: any,
  isTeamLeader: boolean,
  onClose: () => void,
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>,
  setPendingMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>,
  fetchTeamMembers: () => Promise<void>,
  onTeamUpdate?: () => void
) => {
  const {
    loading: acceptanceLoading,
    handleAcceptMember,
    handleRejectMember
  } = useTeamMemberAcceptance(isTeamLeader, setPendingMembers, fetchTeamMembers);

  const {
    loading: managementLoading,
    handleRemoveMember,
    handleUpdateMemberRole,
    handleUpdateMemberGameRole,
    handleUpdateMemberAssociationRole
  } = useTeamMemberManagement(isTeamLeader, setTeamMembers, onTeamUpdate);

  const {
    loading: leavingLoading,
    handleLeaveTeam
  } = useTeamLeaving(team, user, isTeamLeader, onClose);

  const loading = acceptanceLoading || managementLoading || leavingLoading;

  return {
    loading,
    setLoading: () => {}, // Keep for backward compatibility but not used
    handleAcceptMember,
    handleRejectMember,
    handleRemoveMember,
    handleUpdateMemberRole,
    handleUpdateMemberGameRole,
    handleUpdateMemberAssociationRole,
    handleLeaveTeam
  };
};
