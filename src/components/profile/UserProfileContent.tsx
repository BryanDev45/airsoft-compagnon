
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileInfo from './ProfileInfo';
import ProfileGames from './ProfileGames';
import ProfileStats from './ProfileStats';
import ProfileEquipment from './ProfileEquipment';
import ProfileBadges from './ProfileBadges';
import ProfileFriends from './ProfileFriends';

interface UserProfileContentProps {
  userData: any;
  profileData: any;
  userStats: any;
  equipment: any[];
  userGames: any[];
  userBadges: any[];
  updateLocation: (location: string) => void;
  updateUserStats: (stats: any) => void;
  fetchProfileData: () => void;
  isOwnProfile: boolean;
  handleViewGameDetails: (game: any) => void;
  handleViewAllGames: () => void;
  handleViewAllBadges: () => void;
}

const UserProfileContent: React.FC<UserProfileContentProps> = ({
  userData,
  profileData,
  userStats,
  equipment,
  userGames,
  userBadges,
  updateLocation,
  updateUserStats,
  fetchProfileData,
  isOwnProfile,
  handleViewGameDetails,
  handleViewAllGames,
  handleViewAllBadges,
}) => {
  const navigate = useNavigate();
  const equipmentTypes = ["Réplique principale", "Réplique secondaire", "Protection", "Accessoire"];

  const handleNavigateToTeam = () => {
    if (profileData?.team_id) {
      navigate(`/team/${profileData.team_id}`);
    }
  };

  return (
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
            user={userData} 
            profileData={profileData}
            updateLocation={updateLocation}
            handleNavigateToTeam={handleNavigateToTeam}
            isOwnProfile={isOwnProfile}
          />
        </TabsContent>
        
        <TabsContent value="games">
          <ProfileGames 
            games={userGames} 
            handleViewGameDetails={handleViewGameDetails} 
            handleViewAllGames={handleViewAllGames} 
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
            readOnly={true}
          />
        </TabsContent>
        
        <TabsContent value="badges">
          <ProfileBadges 
            badges={userBadges} 
            handleViewAllBadges={handleViewAllBadges} 
          />
        </TabsContent>

        <TabsContent value="friends">
          <ProfileFriends 
            userId={userData?.id}
            isOwnProfile={isOwnProfile}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfileContent;
