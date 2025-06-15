
import React from 'react';
import { TeamData } from '@/types/team';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import PendingMembersList from './members/PendingMembersList';
import TeamMembersList from './members/TeamMembersList';

interface TeamSettingsMembersProps {
  team: TeamData;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isTeamAdmin: boolean;
  user: any;
  onClose: () => void;
  onTeamUpdate?: () => void;
}

const TeamSettingsMembers = ({ 
  team, 
  loading, 
  setLoading, 
  isTeamAdmin, 
  user,
  onClose,
  onTeamUpdate
}: TeamSettingsMembersProps) => {
  const {
    teamMembers,
    pendingMembers,
    handleAcceptMember,
    handleRejectMember,
    handleRemoveMember,
    handleUpdateMemberRole,
    handleUpdateMemberGameRole,
    handleUpdateMemberAssociationRole,
    handleLeaveTeam
  } = useTeamMembers(team, user, isTeamAdmin, onClose, onTeamUpdate);

  return (
    <div className="space-y-6">
      {isTeamAdmin && pendingMembers.length > 0 && (
        <PendingMembersList
          pendingMembers={pendingMembers}
          loading={loading}
          handleAcceptMember={handleAcceptMember}
          handleRejectMember={handleRejectMember}
        />
      )}
      
      <TeamMembersList
        teamMembers={teamMembers}
        loading={loading}
        isTeamLeader={isTeamAdmin}
        teamLeaderId={team.leader_id}
        currentUserId={user?.id}
        isAssociation={team.is_association}
        handleRemoveMember={handleRemoveMember}
        handleUpdateMemberRole={handleUpdateMemberRole}
        handleUpdateMemberGameRole={handleUpdateMemberGameRole}
        handleUpdateMemberAssociationRole={handleUpdateMemberAssociationRole}
        handleLeaveTeam={handleLeaveTeam}
      />
    </div>
  );
};

export default TeamSettingsMembers;
