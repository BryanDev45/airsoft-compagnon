
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
  updateNewsletterSubscription
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
          <ProfileContainer title="Informations">
            <ProfileInfo profileData={profileData} userStats={userStats} />
          </ProfileContainer>
          
          <ProfileContainer title="Statistiques" className="mt-6">
            <ProfileStats userStats={userStats} />
          </ProfileContainer>
          
          <ProfileContainer title="Amis" className="mt-6">
            <ProfileFriends userId={user?.id} />
          </ProfileContainer>
        </div>
        
        {/* Right column */}
        <div className="w-full lg:w-2/3">
          <ProfileContainer 
            title="Équipement"
            buttonText="Ajouter"
            onButtonClick={() => dialogStates.setShowAddEquipmentDialog(true)}
          >
            <ProfileEquipment 
              equipment={equipment} 
              userId={user?.id} 
              onAddClick={() => dialogStates.setShowAddEquipmentDialog(true)}
              equipmentTypes={equipmentTypes}
              fetchEquipment={fetchEquipment}
            />
          </ProfileContainer>
          
          <ProfileContainer 
            title="Mes parties" 
            buttonText="Voir tout"
            onButtonClick={() => dialogStates.setShowAllGamesDialog(true)}
            className="mt-6"
          >
            <ProfileGames 
              userId={user?.id}
              userGames={userGames}
              onGameClick={(game) => {
                dialogStates.setSelectedGame(game);
                dialogStates.setShowGameDialog(true);
              }}
            />
          </ProfileContainer>
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
