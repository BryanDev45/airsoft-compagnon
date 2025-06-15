
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import ProfileContainer from './ProfileContainer';
import ProfileDialogs from './ProfileDialogs';

const ProfileLayout = ({
  user,
  profileData,
  userStats,
  equipment,
  userGames,
  userBadges,
  dialogStates,
  equipmentTypes,
  fetchEquipment,
  fetchUserGames,
  fetchProfileData,
  handleAddEquipment
}) => {
  const navigate = useNavigate();

  const handleNavigateToGame = (gameId) => {
    navigate(`/games/${gameId}`);
  };

  const handleViewGameDetails = (game) => {
    dialogStates.showGameDetails(game);
  };

  const handleViewAllGames = () => {
    dialogStates.setShowAllGamesDialog(true);
  };

  const handleViewAllBadges = () => {
    dialogStates.setShowBadgesDialog(true);
  };

  const handleGameClickInAllGamesDialog = (game: any) => {
    dialogStates.setShowAllGamesDialog(false);
    dialogStates.showGameDetails(game);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <ProfileContainer
            user={user}
            profileData={profileData}
            userStats={userStats}
            equipment={equipment}
            userGames={userGames}
            userBadges={userBadges}
            dialogStates={dialogStates}
            equipmentTypes={equipmentTypes}
            fetchEquipment={fetchEquipment}
            fetchUserGames={fetchUserGames}
            fetchProfileData={fetchProfileData}
            handleAddEquipment={handleAddEquipment}
            handleViewGameDetails={handleViewGameDetails}
            handleViewAllGames={handleViewAllGames}
            handleViewAllBadges={handleViewAllBadges}
          />
        </div>
      </main>
      <Footer />
      <ProfileDialogs
        selectedGame={dialogStates.selectedGame}
        showGameDialog={dialogStates.showGameDialog}
        setShowGameDialog={dialogStates.handleOpenChange}
        showAllGamesDialog={dialogStates.showAllGamesDialog}
        setShowAllGamesDialog={dialogStates.setShowAllGamesDialog}
        showBadgesDialog={dialogStates.showBadgesDialog}
        setShowBadgesDialog={dialogStates.setShowBadgesDialog}
        user={profileData}
        userGames={userGames}
        onGameClick={handleGameClickInAllGamesDialog}
      />
    </div>
  );
};

export default ProfileLayout;
