
import React from 'react';
import GameDetailsDialog from './dialogs/GameDetailsDialog';
import AllGamesDialog from './dialogs/AllGamesDialog';
import BadgesDialog from './dialogs/BadgesDialog';

interface ProfileDialogsProps {
  selectedGame: any;
  showGameDialog: boolean;
  setShowGameDialog: (show: boolean) => void;
  showAllGamesDialog: boolean;
  setShowAllGamesDialog: (show: boolean) => void;
  showBadgesDialog: boolean;
  setShowBadgesDialog: (show: boolean) => void;
  user: any;
  userGames: any[];
  onGameClick: (game: any) => void;
}

const ProfileDialogs: React.FC<ProfileDialogsProps> = React.memo(({ 
  selectedGame,
  showGameDialog,
  setShowGameDialog,
  showAllGamesDialog,
  setShowAllGamesDialog,
  showBadgesDialog,
  setShowBadgesDialog,
  user,
  userGames = [],
  onGameClick
}) => {
  
  return (
    <>
      {showGameDialog && (
        <GameDetailsDialog
          selectedGame={selectedGame}
          showGameDialog={showGameDialog}
          setShowGameDialog={setShowGameDialog}
        />
      )}

      {showAllGamesDialog && (
        <AllGamesDialog
          showAllGamesDialog={showAllGamesDialog}
          setShowAllGamesDialog={setShowAllGamesDialog}
          user={user}
          userGames={userGames}
          onGameClick={onGameClick}
        />
      )}

      {showBadgesDialog && (
        <BadgesDialog
          showBadgesDialog={showBadgesDialog}
          setShowBadgesDialog={setShowBadgesDialog}
          user={user}
        />
      )}
    </>
  );
});

ProfileDialogs.displayName = 'ProfileDialogs';

export default ProfileDialogs;
