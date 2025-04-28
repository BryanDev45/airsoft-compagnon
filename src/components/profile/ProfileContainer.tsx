
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileInfo from './ProfileInfo';
import ProfileGames from './ProfileGames';
import ProfileStats from './ProfileStats';
import ProfileEquipment from './ProfileEquipment';
import ProfileBadges from './ProfileBadges';
import ProfileFriends from './ProfileFriends';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
interface ProfileContainerProps {
  user: any;
  profileData: any;
  userStats: any;
  equipment: any[];
  updateLocation: (location: string) => Promise<boolean>;
  updateUserStats: (gameType: string, role: string, level: string) => Promise<boolean>;
  fetchProfileData: () => Promise<void>;
  fetchEquipment: () => Promise<void>;
  handleNavigateToTeam: () => void;
  setSelectedGame: (game: any) => void;
  setShowGameDialog: (show: boolean) => void;
  setShowAllGamesDialog: (show: boolean) => void;
  setShowBadgesDialog: (show: boolean) => void;
  setShowAddEquipmentDialog: (show: boolean) => void;
  isOwnProfile: boolean;
  equipmentTypes: string[];
}
const ProfileContainer: React.FC<ProfileContainerProps> = ({
  user,
  profileData,
  userStats,
  equipment,
  updateLocation,
  updateUserStats,
  fetchProfileData,
  fetchEquipment,
  handleNavigateToTeam,
  setSelectedGame,
  setShowGameDialog,
  setShowAllGamesDialog,
  setShowBadgesDialog,
  setShowAddEquipmentDialog,
  isOwnProfile,
  equipmentTypes
}) => {
  return <div className="p-6">
      <Tabs defaultValue="profile" className="rounded-md">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="games">Mes parties</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="equipment">Équipement</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="friends">Amis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="p-1">
          <ProfileInfo user={user} profileData={profileData} updateLocation={updateLocation} handleNavigateToTeam={handleNavigateToTeam} isOwnProfile={isOwnProfile} />
        </TabsContent>
        
        <TabsContent value="games" className="p-1">
          <ProfileGames games={profileData?.games || []} handleViewGameDetails={game => {
          setSelectedGame(game);
          setShowGameDialog(true);
        }} handleViewAllGames={() => setShowAllGamesDialog(true)} />
        </TabsContent>
        
        <TabsContent value="stats" className="p-1">
          <ProfileStats 
            userStats={userStats} 
            updateUserStats={updateUserStats} 
            fetchProfileData={fetchProfileData} 
            isOwnProfile={isOwnProfile} 
          />
        </TabsContent>
        
        <TabsContent value="equipment" className="p-1">
          {isOwnProfile && <div className="mb-4 flex justify-end">
              <Button onClick={() => setShowAddEquipmentDialog(true)} className="bg-airsoft-red hover:bg-red-700 text-white">
                <Plus className="h-4 w-4 mr-2" /> Ajouter un équipement
              </Button>
            </div>}
          
          <div className="grid grid-cols-1 gap-6">
            <ProfileEquipment equipment={equipment} readOnly={!isOwnProfile} equipmentTypes={equipmentTypes} fetchEquipment={fetchEquipment} />
          </div>
        </TabsContent>
        
        <TabsContent value="badges" className="p-1">
          <ProfileBadges badges={profileData?.badges || []} handleViewAllBadges={() => setShowBadgesDialog(true)} />
        </TabsContent>

        <TabsContent value="friends" className="p-1">
          <ProfileFriends userId={user?.id} isOwnProfile={isOwnProfile} />
        </TabsContent>
      </Tabs>
    </div>;
};
export default ProfileContainer;
