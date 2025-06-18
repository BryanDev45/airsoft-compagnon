
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileInfo from './ProfileInfo';
import ProfileGames from './ProfileGames';
import ProfileStats from './ProfileStats';
import ProfileEquipment from './ProfileEquipment';
import ProfileBadges from './ProfileBadges';
import ProfileFriends from './ProfileFriends';
import ProfileHeader from './ProfileHeader';
import ProfileSettingsDialog from './ProfileSettingsDialog';
import ProfileEditBioDialog from './ProfileEditBioDialog';
import ProfileAddEquipmentDialog from './ProfileAddEquipmentDialog';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProfileContainerProps {
  user: any;
  profileData: any;
  userStats: any;
  equipment: any[];
  userGames: any[];
  userBadges: any[];
  dialogStates: any;
  equipmentTypes: string[];
  fetchEquipment: () => Promise<void>;
  fetchUserGames?: () => Promise<void>;
  fetchProfileData: () => Promise<void>;
  handleAddEquipment: any;
  handleViewGameDetails: (game: any) => void;
  handleViewAllGames: () => void;
  handleViewAllBadges: () => void;
}

const ProfileContainer: React.FC<ProfileContainerProps> = ({
  user,
  profileData,
  userStats,
  equipment,
  userGames = [],
  userBadges,
  dialogStates,
  equipmentTypes,
  fetchEquipment,
  fetchUserGames,
  fetchProfileData,
  handleAddEquipment,
  handleViewGameDetails,
  handleViewAllGames,
  handleViewAllBadges,
}) => {
  // Extract dialog state functions from dialogStates object
  const {
    showSettingsDialog,
    setShowSettingsDialog,
    showEditBioDialog,
    setShowEditBioDialog,
    showAddEquipmentDialog,
    setShowAddEquipmentDialog,
  } = dialogStates;

  const toggleProfileSettings = () => {
    console.log('Opening settings dialog');
    setShowSettingsDialog(true);
  };

  const onEditBio = () => {
    console.log('Opening edit bio dialog');
    setShowEditBioDialog(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Profile Header with banner, avatar, and buttons */}
        <ProfileHeader 
          user={user}
          isOwnProfile={true}
          toggleProfileSettings={toggleProfileSettings}
          onEditBio={onEditBio}
        />
        
        {/* Tabs Content */}
        <div className="p-4 sm:p-6">
          <Tabs defaultValue="profile" className="rounded-md">
            <div className="overflow-x-auto -mx-6 px-6 mb-6">
              <TabsList className="justify-start sm:justify-center">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="games">Mes parties</TabsTrigger>
                <TabsTrigger value="stats">Statistiques</TabsTrigger>
                <TabsTrigger value="equipment">Équipement</TabsTrigger>
                <TabsTrigger value="badges">Badges</TabsTrigger>
                <TabsTrigger value="friends">Amis</TabsTrigger>
              </TabsList>
            </div>
            
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
              <div className="mb-4 flex justify-center sm:justify-end">
                <Button 
                  onClick={() => setShowAddEquipmentDialog(true)} 
                  className="bg-airsoft-red hover:bg-red-700 text-white w-full sm:w-auto"
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
                badges={userBadges || []} 
                handleViewAllBadges={handleViewAllBadges}
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

      {/* Profile Settings Dialog */}
      <ProfileSettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        user={user}
      />

      {/* Profile Edit Bio Dialog */}
      <ProfileEditBioDialog
        open={showEditBioDialog}
        onOpenChange={setShowEditBioDialog}
        currentBio={user?.bio || ''}
        currentUsername={user?.username || ''}
      />

      {/* Profile Add Equipment Dialog */}
      <ProfileAddEquipmentDialog
        open={showAddEquipmentDialog}
        onOpenChange={setShowAddEquipmentDialog}
        onAddEquipment={handleAddEquipment}
        equipmentTypes={equipmentTypes}
      />
    </>
  );
};

export default ProfileContainer;
