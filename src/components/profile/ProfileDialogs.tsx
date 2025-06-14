
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  handleNavigateToGame: (gameId: string) => void;
  user: any;
  userGames: any[];
}

const ProfileDialogs: React.FC<ProfileDialogsProps> = ({ 
  selectedGame,
  showGameDialog,
  setShowGameDialog,
  showAllGamesDialog,
  setShowAllGamesDialog,
  showBadgesDialog,
  setShowBadgesDialog,
  handleNavigateToGame,
  user,
  userGames = []
}) => {
  const navigate = useNavigate();

  const handleGameClick = (game: any) => {
    // Enrichir les données du jeu avec toutes les informations nécessaires pour le dialog
    const enrichedGame = {
      ...game,
      // S'assurer que toutes les propriétés nécessaires sont présentes
      participantsCount: game.participants || game.participantsCount || 0,
      max_players: game.maxParticipants || game.max_players,
      // Construire l'adresse complète si elle n'existe pas
      address: game.location || (game.city && game.zip_code ? `${game.city}, ${game.zip_code}` : game.address) || 'Lieu non spécifié'
    };
    
    // Fermer le dialog "toutes les parties" et ouvrir le dialog de détails
    setShowAllGamesDialog(false);
    setShowGameDialog(true);
    // Note: il faudrait aussi passer selectedGame, mais comme on ne peut pas le faire ici,
    // on va utiliser handleNavigateToGame directement
    if (game.id) {
      handleNavigateToGame(game.id);
    }
  };
  
  return (
    <>
      <GameDetailsDialog
        selectedGame={selectedGame}
        showGameDialog={showGameDialog}
        setShowGameDialog={setShowGameDialog}
      />

      <AllGamesDialog
        showAllGamesDialog={showAllGamesDialog}
        setShowAllGamesDialog={setShowAllGamesDialog}
        user={user}
        userGames={userGames}
        onGameClick={handleGameClick}
      />

      <BadgesDialog
        showBadgesDialog={showBadgesDialog}
        setShowBadgesDialog={setShowBadgesDialog}
        user={user}
      />
    </>
  );
};

export default ProfileDialogs;
