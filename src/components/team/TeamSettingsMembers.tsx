
import React from 'react';
import { TeamData } from '@/types/team';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import PendingMembersList from './members/PendingMembersList';
import TeamMembersList from './members/TeamMembersList';

interface TeamSettingsMembersProps {
  team: TeamData;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isTeamLeader: boolean;
  user: any;
  onClose: () => void;
}

const TeamSettingsMembers = ({ 
  team, 
  loading, 
  setLoading, 
  isTeamLeader, 
  user,
  onClose
}: TeamSettingsMembersProps) => {
  const {
    teamMembers,
    pendingMembers,
    handleAcceptMember,
    handleRejectMember,
    handleRemoveMember,
    handleUpdateMemberRole,
    handleUpdateMemberGameRole,
    handleLeaveTeam
  } = useTeamMembers(team, user, isTeamLeader, onClose);

  return (
    <div className="space-y-6">
      {isTeamLeader && pendingMembers.length > 0 && (
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
        isTeamLeader={isTeamLeader}
        teamLeaderId={team.leader_id}
        currentUserId={user?.id}
        handleRemoveMember={handleRemoveMember}
        handleUpdateMemberRole={handleUpdateMemberRole}
        handleUpdateMemberGameRole={handleUpdateMemberGameRole}
        handleLeaveTeam={handleLeaveTeam}
      />
    </div>
  );
};

export default TeamSettingsMembers;
