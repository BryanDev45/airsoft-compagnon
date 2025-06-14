
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
    dialogStates.setSelectedGame(game);
    dialogStates.setShowGameDialog(true);
  };

  const handleViewAllGames = () => {
    dialogStates.setShowAllGamesDialog(true);
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
            dialogStates={dialogStates}
            equipmentTypes={equipmentTypes}
            fetchEquipment={fetchEquipment}
            fetchUserGames={fetchUserGames}
            fetchProfileData={fetchProfileData}
            handleAddEquipment={handleAddEquipment}
            handleViewGameDetails={handleViewGameDetails}
            handleViewAllGames={handleViewAllGames}
          />
          
          <ProfileDialogs
            selectedGame={dialogStates.selectedGame}
            showGameDialog={dialogStates.showGameDialog}
            setShowGameDialog={dialogStates.setShowGameDialog}
            showAllGamesDialog={dialogStates.showAllGamesDialog}
            setShowAllGamesDialog={dialogStates.setShowAllGamesDialog}
            showBadgesDialog={dialogStates.showBadgesDialog}
            setShowBadgesDialog={dialogStates.setShowBadgesDialog}
            handleNavigateToGame={handleNavigateToGame}
            user={user}
            userGames={userGames}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileLayout;
