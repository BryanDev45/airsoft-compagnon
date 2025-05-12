
import React from 'react';
import ProfileContainer from './ProfileContainer';
import ProfileHeader from './ProfileHeader';
import ProfileInfo from './ProfileInfo';
import ProfileStats from './ProfileStats';
import ProfileEquipment from './ProfileEquipment';
import ProfileGames from './ProfileGames';
import ProfileFriends from './ProfileFriends';
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
  updateNewsletterSubscription,
  updateLocation,
  updateUserStats
}) => {
  return (
    <div className="container mx-auto py-6 px-4">
      {/* Section Header */}
      <div className="mb-6">
        <ProfileHeader 
          user={user}
          isOwnProfile={true}
          toggleProfileSettings={() => dialogStates.setShowSettingsDialog(true)}
          onEditBio={() => dialogStates.setShowEditBioDialog(true)}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column */}
        <div className="w-full lg:w-1/3">
          <div className="mb-6">
            <ProfileInfo 
              user={user} 
              profileData={profileData} 
              updateLocation={updateLocation}
              handleNavigateToTeam={() => {}}
              isOwnProfile={true}
            />
          </div>
          
          <div className="mb-6">
            <ProfileStats 
              userStats={userStats}
              updateUserStats={updateUserStats}
              fetchProfileData={fetchProfileData}
              isOwnProfile={true}
              profileData={profileData}
            />
          </div>
          
          <div className="mb-6">
            <ProfileFriends 
              userId={user?.id}
              isOwnProfile={true}
            />
          </div>
        </div>
        
        {/* Right column */}
        <div className="w-full lg:w-2/3">
          <div className="mb-6">
            <ProfileEquipment 
              equipment={equipment} 
              readOnly={false}
              equipmentTypes={equipmentTypes}
              fetchEquipment={fetchEquipment}
            />
            <div className="mt-4 flex justify-end">
              <button 
                className="bg-airsoft-red hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={() => dialogStates.setShowAddEquipmentDialog(true)}
              >
                Ajouter un équipement
              </button>
            </div>
          </div>
          
          <div>
            <ProfileGames 
              games={userGames || []}
              handleViewGameDetails={(game) => {
                dialogStates.setSelectedGame(game);
                dialogStates.setShowGameDialog(true);
              }} 
              handleViewAllGames={() => dialogStates.setShowAllGamesDialog(true)} 
            />
          </div>
        </div>
      </div>
      
      {/* All Dialogs */}
      <ProfileDialogs 
        dialogStates={dialogStates}
        user={user}
        currentBio={profileData?.bio}
        currentUsername={profileData?.username}
        equipmentTypes={equipmentTypes}
        handleAddEquipment={handleAddEquipment}
        updateNewsletterSubscription={updateNewsletterSubscription}
      />
    </div>
  );
};

export default ProfileLayout;
