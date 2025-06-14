
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileInfo from './ProfileInfo';
import ProfileGames from './ProfileGames';
import ProfileStats from './ProfileStats';
import ProfileEquipment from './ProfileEquipment';
import ProfileBadges from './ProfileBadges';
import ProfileFriends from './ProfileFriends';
import ProfileHeader from './ProfileHeader';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProfileContainerProps {
  user: any;
  profileData: any;
  userStats: any;
  equipment: any[];
  userGames: any[];
  dialogStates: any;
  equipmentTypes: string[];
  fetchEquipment: () => Promise<void>;
  fetchUserGames?: () => Promise<void>;
  fetchProfileData: () => Promise<void>;
  handleAddEquipment: any;
  handleViewGameDetails: (game: any) => void;
  handleViewAllGames: () => void;
}

const ProfileContainer: React.FC<ProfileContainerProps> = ({
  user,
  profileData,
  userStats,
  equipment,
  userGames = [],
  dialogStates,
  equipmentTypes,
  fetchEquipment,
  fetchUserGames,
  fetchProfileData,
  handleAddEquipment,
  handleViewGameDetails,
  handleViewAllGames
}) => {
  // Extract dialog state functions from dialogStates object
  const {
    setShowAddEquipmentDialog,
    setShowBadgesDialog,
    setShowSettingsDialog,
    setShowEditBioDialog
  } = dialogStates;

  const toggleProfileSettings = () => {
    setShowSettingsDialog(true);
  };

  const onEditBio = () => {
    setShowEditBioDialog(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Profile Header with banner, avatar, and buttons */}
      <ProfileHeader 
        user={user}
        isOwnProfile={true}
        toggleProfileSettings={toggleProfileSettings}
        onEditBio={onEditBio}
      />
      
      {/* Tabs Content */}
      <div className="p-6">
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
            <ProfileInfo 
              user={user} 
              profileData={profileData} 
              updateLocation={async () => true}
              handleNavigateToTeam={() => {}}
              isOwnProfile={true}
            />
          </TabsContent>
          
          <TabsContent value="games" className="p-1">
            <ProfileGames 
              games={userGames.length > 0 ? userGames : (profileData?.games || [])} 
              handleViewGameDetails={handleViewGameDetails}
              handleViewAllGames={handleViewAllGames}
            />
          </TabsContent>
          
          <TabsContent value="stats" className="p-1">
            <ProfileStats 
              userStats={userStats} 
              updateUserStats={async () => true}
              fetchProfileData={fetchProfileData} 
              isOwnProfile={true}
              profileData={profileData}
            />
          </TabsContent>
          
          <TabsContent value="equipment" className="p-1">
            <div className="mb-4 flex justify-end">
              <Button 
                onClick={() => setShowAddEquipmentDialog(true)} 
                className="bg-airsoft-red hover:bg-red-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" /> Ajouter un équipement
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <ProfileEquipment 
                equipment={equipment} 
                readOnly={false}
                equipmentTypes={equipmentTypes}
                fetchEquipment={fetchEquipment}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="badges" className="p-1">
            <ProfileBadges 
              badges={profileData?.badges || []} 
              handleViewAllBadges={() => setShowBadgesDialog(true)}
            />
          </TabsContent>

          <TabsContent value="friends" className="p-1">
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
