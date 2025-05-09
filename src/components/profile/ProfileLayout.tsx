
import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import ProfileHeader from './ProfileHeader';
import ProfileContainer from './ProfileContainer';
import ProfileDialogs from './ProfileDialogs';
import ProfileSettingsDialog from './ProfileSettingsDialog';
import ProfileEditMediaDialog from './ProfileEditMediaDialog';
import ProfileEditBioDialog from './ProfileEditBioDialog';
import ProfileAddEquipmentDialog from './ProfileAddEquipmentDialog';
import { useNavigate } from 'react-router-dom';

interface ProfileLayoutProps {
  user: any;
  profileData: any;
  userStats: any;
  equipment: any[];
  userGames: any[];
  dialogStates: any;
  equipmentTypes: string[];
  fetchEquipment: () => Promise<void>;
  fetchUserGames: () => Promise<void>;
  fetchProfileData: () => Promise<void>;
  handleAddEquipment: (equipment: any) => Promise<boolean>;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({
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
  handleAddEquipment
}) => {
  const navigate = useNavigate();
  
  const handleNavigateToTeam = () => {
    if (profileData?.team_id) {
      navigate(`/team/${profileData.team_id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ProfileHeader 
              user={profileData}
              isOwnProfile={true} 
              toggleProfileSettings={() => dialogStates.setShowSettingsDialog(true)}
              onEditBio={() => dialogStates.setShowEditBioDialog(true)}
              onEditMedia={() => dialogStates.setShowEditMediaDialog(true)}
            />

            <ProfileContainer 
              user={user}
              profileData={profileData}
              userStats={userStats}
              equipment={equipment}
              games={userGames}
              isOwnProfile={true}
              equipmentTypes={equipmentTypes}
              updateLocation={async (location) => {
                console.log("Updating location to:", location);
                return true;
              }}
              updateUserStats={async () => true}
              fetchProfileData={fetchProfileData}
              fetchEquipment={fetchEquipment}
              fetchUserGames={fetchUserGames}
              handleNavigateToTeam={handleNavigateToTeam}
              setSelectedGame={dialogStates.setSelectedGame}
              setShowGameDialog={dialogStates.setShowGameDialog}
              setShowAllGamesDialog={dialogStates.setShowAllGamesDialog}
              setShowBadgesDialog={dialogStates.setShowBadgesDialog}
              setShowAddEquipmentDialog={dialogStates.setShowAddEquipmentDialog}
              setShowEditMediaDialog={dialogStates.setShowEditMediaDialog}
              setShowEditBioDialog={dialogStates.setShowEditBioDialog}
            />
          </div>
        </div>
      </main>
      <Footer />

      {/* All dialogs */}
      <ProfileSettingsDialog 
        open={dialogStates.showSettingsDialog} 
        onOpenChange={dialogStates.setShowSettingsDialog}
        user={user} 
      />
      
      <ProfileEditMediaDialog 
        open={dialogStates.showEditMediaDialog} 
        onOpenChange={dialogStates.setShowEditMediaDialog} 
      />
      
      <ProfileEditBioDialog 
        open={dialogStates.showEditBioDialog} 
        onOpenChange={dialogStates.setShowEditBioDialog} 
        user={profileData}
        onUpdate={fetchProfileData}
      />
      
      <ProfileAddEquipmentDialog 
        open={dialogStates.showAddEquipmentDialog}
        onOpenChange={dialogStates.setShowAddEquipmentDialog}
        onEquipmentAdded={handleAddEquipment}
        userId={user?.id}
        equipmentTypes={equipmentTypes}
      />
      
      <ProfileDialogs
        selectedGame={dialogStates.selectedGame}
        showGameDialog={dialogStates.showGameDialog}
        setShowGameDialog={dialogStates.setShowGameDialog}
        showAllGamesDialog={dialogStates.showAllGamesDialog}
        setShowAllGamesDialog={dialogStates.setShowAllGamesDialog}
        showBadgesDialog={dialogStates.showBadgesDialog}
        setShowBadgesDialog={dialogStates.setShowBadgesDialog}
        handleNavigateToGame={() => {}}
        user={profileData}
      />
    </div>
  );
};

export default ProfileLayout;
