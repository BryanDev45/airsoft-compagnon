
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileInfo from './ProfileInfo';
import ProfileGames from './ProfileGames';
import ProfileStats from './ProfileStats';
import ProfileEquipment from './ProfileEquipment';
import ProfileBadges from './ProfileBadges';

interface ProfileTabsProps {
  userData: any;
  profileData: any;
  userStats: any;
  equipment: any[];
  equipmentTypes: string[];
  updateLocation: (location: string) => Promise<boolean>;
  updateUserStats: (gameType: string, role: string, level: string) => Promise<boolean>;
  fetchProfileData: () => Promise<void>;
  handleNavigateToTeam: () => void;
  setSelectedGame: (game: any) => void;
  setShowGameDialog: (show: boolean) => void;
  setShowAllGamesDialog: (show: boolean) => void;
  setShowBadgesDialog: (show: boolean) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  userData,
  profileData,
  userStats,
  equipment,
  equipmentTypes,
  updateLocation,
  updateUserStats,
  fetchProfileData,
  handleNavigateToTeam,
  setSelectedGame,
  setShowGameDialog,
  setShowAllGamesDialog,
  setShowBadgesDialog,
}) => {
  return (
    <div className="p-6">
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="games">Parties</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="equipment">Équipement</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileInfo 
            user={userData}
            profileData={profileData}
            updateLocation={updateLocation}
            handleNavigateToTeam={handleNavigateToTeam}
          />
        </TabsContent>
        
        <TabsContent value="games">
          <ProfileGames 
            games={profileData?.games || []} 
            handleViewGameDetails={(game) => {
              setSelectedGame(game);
              setShowGameDialog(true);
            }}
            handleViewAllGames={() => setShowAllGamesDialog(true)}
          />
        </TabsContent>
        
        <TabsContent value="stats">
          <ProfileStats 
            userStats={userStats}
            updateUserStats={updateUserStats}
            fetchProfileData={fetchProfileData}
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
            badges={profileData?.badges || []}
            handleViewAllBadges={() => setShowBadgesDialog(true)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
