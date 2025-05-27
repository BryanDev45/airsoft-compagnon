
import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import ProfileHeader from './ProfileHeader';
import ProfileContainer from './ProfileContainer';
import ProfileDialogs from './ProfileDialogs';
import ProfileSettingsDialog from './ProfileSettingsDialog';
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
  
  const {
    showSettingsDialog,
    setShowSettingsDialog,
    showEditBioDialog,
    setShowEditBioDialog,
    showAddEquipmentDialog,
    setShowAddEquipmentDialog,
    selectedGame,
    setSelectedGame,
    showGameDialog,
    setShowGameDialog,
    showAllGamesDialog,
    setShowAllGamesDialog,
    showBadgesDialog,
    setShowBadgesDialog
  } = dialogStates;

  const handleNavigateToTeam = () => {
    if (profileData?.team_id) {
      navigate(`/team/${profileData.team_id}`);
    } else {
      navigate('/team/create');
    }
  };

  const handleNavigateToGame = (gameId) => {
    navigate(`/game/${gameId}`);
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
              toggleProfileSettings={() => setShowSettingsDialog(true)}
              onEditBio={() => setShowEditBioDialog(true)}
            />
            
            <ProfileContainer
              user={user}
              profileData={profileData}
              userStats={userStats}
              equipment={equipment}
              userGames={userGames}
              updateLocation={(location) => {
                // This is handled by useProfileData hook and passed to Profile.tsx
                return Promise.resolve(false);
              }}
              updateUserStats={(gameType, role, level) => {
                // This is handled by useProfileData hook and passed to Profile.tsx
                return Promise.resolve(false);
              }}
              fetchProfileData={fetchProfileData}
              handleNavigateToTeam={handleNavigateToTeam}
              setSelectedGame={setSelectedGame}
              setShowGameDialog={setShowGameDialog}
              setShowAllGamesDialog={setShowAllGamesDialog}
              setShowBadgesDialog={setShowBadgesDialog}
              setShowAddEquipmentDialog={setShowAddEquipmentDialog}
              isOwnProfile={true}
              equipmentTypes={equipmentTypes}
              handleAddEquipment={handleAddEquipment}
              dialogStates={dialogStates}
              toggleProfileSettings={() => setShowSettingsDialog(true)}
              onEditBio={() => setShowEditBioDialog(true)}
            />
          </div>
        </div>
      </main>
      <Footer />

      <ProfileDialogs 
        selectedGame={selectedGame}
        showGameDialog={showGameDialog}
        setShowGameDialog={setShowGameDialog}
        showAllGamesDialog={showAllGamesDialog}
        setShowAllGamesDialog={setShowAllGamesDialog}
        showBadgesDialog={showBadgesDialog}
        setShowBadgesDialog={setShowBadgesDialog}
        user={profileData}
        handleNavigateToGame={handleNavigateToGame}
      />

      <ProfileSettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        user={profileData}
      />

      <ProfileEditBioDialog
        open={showEditBioDialog}
        onOpenChange={setShowEditBioDialog}
        currentBio={profileData?.bio || ''}
        currentUsername={profileData?.username || ''}
      />
      
      <ProfileAddEquipmentDialog
        open={showAddEquipmentDialog}
        onOpenChange={setShowAddEquipmentDialog}
        onAddEquipment={handleAddEquipment}
        equipmentTypes={equipmentTypes}
      />
    </div>
  );
};

export default ProfileLayout;
