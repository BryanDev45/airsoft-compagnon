
import React from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileContainer from './ProfileContainer';
import ProfileInfo from './ProfileInfo';
import ProfileStats from './ProfileStats';
import ProfileFriends from './ProfileFriends';
import ProfileEquipment from './ProfileEquipment';
import ProfileGames from './ProfileGames';
import ProfileDialogs from './ProfileDialogs';

const ProfileLayout = ({
  user,
  profileData,
  userStats,
  equipment,
  userGames,
  dialogStates,
  equipmentTypes,
  fetchEquipment,
  fetchUserGames,
  fetchProfileData,
  handleAddEquipment,
  updateLocation,
  updateUserStats,
  updateNewsletterSubscription
}) => {
  // Function to handle navigation to user's team page
  const handleNavigateToTeam = () => {
    if (profileData?.team_id) {
      window.location.href = `/team/${profileData.team_id}`;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <ProfileHeader
        user={user}
        profile={profileData}
        openBioDialog={() => dialogStates.setShowEditBioDialog(true)}
        openSettingsDialog={() => dialogStates.setShowSettingsDialog(true)}
        openMediaDialog={() => dialogStates.setShowEditMediaDialog(true)}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
          <ProfileContainer title="Informations">
            <ProfileInfo
              user={user}
              profileData={profileData}
              updateLocation={updateLocation}
              handleNavigateToTeam={handleNavigateToTeam}
              isOwnProfile={true}
            />
          </ProfileContainer>

          <ProfileContainer title="Statistiques" className="bg-white rounded-lg shadow-md p-6">
            <ProfileStats
              userStats={userStats}
              updateUserStats={updateUserStats}
              fetchProfileData={fetchProfileData}
              isOwnProfile={true}
              profileData={profileData}
            />
          </ProfileContainer>

          <ProfileContainer title="Amis" className="bg-white rounded-lg shadow-md p-6">
            <ProfileFriends
              userId={user.id}
              isOwnProfile={true}
            />
          </ProfileContainer>
        </div>

        <div className="md:col-span-2 space-y-8">
          <ProfileContainer
            title="Équipement"
            buttonText="Ajouter"
            onButtonClick={() => dialogStates.setShowAddEquipmentDialog(true)}
          >
            <ProfileEquipment
              equipment={equipment}
              equipmentTypes={equipmentTypes}
              readOnly={false}
              onEditClick={(item) => {
                dialogStates.setSelectedEquipment(item);
                dialogStates.setShowEditEquipmentDialog(true);
              }}
              fetchEquipment={fetchEquipment}
            />
          </ProfileContainer>

          <ProfileContainer
            title="Mes parties"
            buttonText="Voir tout"
            onButtonClick={() => {}} 
            className="bg-white rounded-lg shadow-md p-6"
          >
            <ProfileGames
              games={userGames}
              handleViewGameDetails={() => {}}
              handleViewAllGames={() => {}}
            />
          </ProfileContainer>
        </div>
      </div>

      <ProfileDialogs
        dialogStates={dialogStates}
        user={user}
        currentBio={profileData?.bio || ''}
        currentUsername={profileData?.username || ''}
        equipmentTypes={equipmentTypes}
        handleAddEquipment={handleAddEquipment}
        updateNewsletterSubscription={updateNewsletterSubscription}
      />
    </div>
  );
};

export default ProfileLayout;
