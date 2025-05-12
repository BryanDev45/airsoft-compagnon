
import React from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileInfo from './ProfileInfo';
import ProfileStats from './ProfileStats';
import ProfileFriends from './ProfileFriends';
import ProfileEquipment from './ProfileEquipment';
import ProfileGames from './ProfileGames';
import ProfileDialogs from './ProfileDialogs';

// Define a simplified container component to replace ProfileContainer
const SimpleContainer = ({ title, children, className = "bg-white rounded-lg shadow-md p-6", buttonText, onButtonClick }) => {
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {buttonText && onButtonClick && (
          <button 
            onClick={onButtonClick}
            className="px-4 py-2 bg-airsoft-red text-white rounded-md hover:bg-red-700 transition-colors"
          >
            {buttonText}
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

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
        isOwnProfile={true}
        toggleProfileSettings={() => dialogStates.setShowSettingsDialog(true)}
        onEditBio={() => dialogStates.setShowEditBioDialog(true)}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
          <SimpleContainer title="Informations">
            <ProfileInfo
              user={user}
              profileData={profileData}
              updateLocation={updateLocation}
              handleNavigateToTeam={handleNavigateToTeam}
              isOwnProfile={true}
            />
          </SimpleContainer>

          <SimpleContainer title="Statistiques" className="bg-white rounded-lg shadow-md p-6">
            <ProfileStats
              userStats={userStats}
              updateUserStats={updateUserStats}
              fetchProfileData={fetchProfileData}
              isOwnProfile={true}
              profileData={profileData}
            />
          </SimpleContainer>

          <SimpleContainer title="Amis" className="bg-white rounded-lg shadow-md p-6">
            <ProfileFriends
              userId={user.id}
              isOwnProfile={true}
            />
          </SimpleContainer>
        </div>

        <div className="md:col-span-2 space-y-8">
          <SimpleContainer
            title="Équipement"
            buttonText="Ajouter"
            onButtonClick={() => dialogStates.setShowAddEquipmentDialog(true)}
          >
            <ProfileEquipment
              equipment={equipment}
              equipmentTypes={equipmentTypes}
              readOnly={false}
              fetchEquipment={fetchEquipment}
            />
          </SimpleContainer>

          <SimpleContainer
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
          </SimpleContainer>
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
