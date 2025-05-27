
import React from 'react';
import ProfileHeader from './ProfileHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileInfo from './ProfileInfo';
import ProfileGames from './ProfileGames';
import ProfileStats from './ProfileStats';
import ProfileEquipment from './ProfileEquipment';
import ProfileBadges from './ProfileBadges';
import ProfileFriends from './ProfileFriends';

const ProfileContainer = ({
  user,
  profileData,
  userStats,
  equipment,
  userGames,
  userBadges = [],
  dialogStates,
  equipmentTypes,
  handleAddEquipment,
  updateLocation,
  updateUserStats,
  fetchProfileData,
  handleNavigateToTeam,
  onEditBio,
  toggleProfileSettings
}) => {
  const handleNavigateToGame = (gameId) => {
    window.location.href = `/game/${gameId}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <ProfileHeader 
        user={{
          ...user,
          team_logo: profileData?.team_logo || user?.team_logo,
          team_name: profileData?.team || user?.team_name
        }}
        isOwnProfile={true}
        toggleProfileSettings={toggleProfileSettings}
        onEditBio={onEditBio}
      />
      
      <div className="p-6">
        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="games">Parties</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
            <TabsTrigger value="equipment">Équipement</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="friends">Amis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileInfo 
              user={user} 
              profileData={profileData}
              updateLocation={updateLocation}
              handleNavigateToTeam={handleNavigateToTeam}
              isOwnProfile={true}
            />
          </TabsContent>
          
          <TabsContent value="games">
            <ProfileGames 
              games={userGames} 
              handleViewGameDetails={(game) => dialogStates.setShowGameDialog(true)} 
              handleViewAllGames={() => dialogStates.setShowAllGamesDialog(true)} 
            />
          </TabsContent>
          
          <TabsContent value="stats">
            <ProfileStats 
              userStats={userStats}
              updateUserStats={updateUserStats}
              fetchProfileData={fetchProfileData}
              profileData={profileData}
            />
          </TabsContent>
          
          <TabsContent value="equipment">
            <ProfileEquipment 
              equipment={equipment} 
              equipmentTypes={equipmentTypes}
              readOnly={false}
            />
          </TabsContent>
          
          <TabsContent value="badges">
            <ProfileBadges 
              badges={userBadges} 
              handleViewAllBadges={() => dialogStates.setShowBadgesDialog(true)} 
            />
          </TabsContent>

          <TabsContent value="friends">
            <ProfileFriends 
              userId={user?.id}
              isOwnProfile={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileContainer;
