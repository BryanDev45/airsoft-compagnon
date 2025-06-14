
import React from 'react';
import { TeamData } from '@/types/team';
import { useAuth } from '@/hooks/useAuth';
import { useTeamSettings } from '@/hooks/useTeamSettings';
import TeamInfoForm from './general/TeamInfoForm';
import TeamDescriptionEditor from './general/TeamDescriptionEditor';
import TeamRecruitmentToggle from './general/TeamRecruitmentToggle';
import TeamAssociationToggle from './general/TeamAssociationToggle';

interface TeamSettingsGeneralProps {
  team: TeamData;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onTeamUpdate?: (updatedTeam: Partial<TeamData>) => void;
  isTeamAdmin: boolean;
}

const TeamSettingsGeneral = ({ team, loading, setLoading, onTeamUpdate, isTeamAdmin }: TeamSettingsGeneralProps) => {
  const {
    name,
    setName,
    location,
    setLocation,
    founded,
    setFounded,
    description,
    setDescription,
    isEditingBio,
    setIsEditingBio,
    isRecruitmentOpen,
    isAssociation,
    handleUpdateTeamInfo,
    handleUpdateDescription,
    handleToggleRecruitment,
    handleToggleAssociation
  } = useTeamSettings(team, onTeamUpdate, isTeamAdmin);

  return (
    <div className="space-y-4">
      <TeamInfoForm
        name={name}
        setName={setName}
        location={location}
        setLocation={setLocation}
        founded={founded}
        setFounded={setFounded}
        loading={loading}
        handleUpdateTeamInfo={handleUpdateTeamInfo}
        disabled={!isTeamAdmin}
      />
      
      <TeamDescriptionEditor
        description={description}
        setDescription={setDescription}
        isEditingBio={isEditingBio}
        setIsEditingBio={setIsEditingBio}
        loading={loading}
        handleUpdateDescription={handleUpdateDescription}
        originalDescription={team.description}
      />
      
      {isTeamAdmin && (
        <>
          <TeamRecruitmentToggle
            isRecruitmentOpen={isRecruitmentOpen}
            handleToggleRecruitment={handleToggleRecruitment}
            loading={loading}
          />
          
          <TeamAssociationToggle
            isAssociation={isAssociation}
            handleToggleAssociation={handleToggleAssociation}
            loading={loading}
          />
        </>
      )}
    </div>
  );
};

export default TeamSettingsGeneral;
