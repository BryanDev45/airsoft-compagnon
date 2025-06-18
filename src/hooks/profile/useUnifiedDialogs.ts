
import { useState } from 'react';

/**
 * Hook unifié pour gérer tous les états de dialogs du profil
 */
export const useUnifiedDialogs = () => {
  // États pour les dialogs de base
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showEditBioDialog, setShowEditBioDialog] = useState(false);
  const [showAddEquipmentDialog, setShowAddEquipmentDialog] = useState(false);
  
  // États pour les dialogs de jeux
  const [showGameDialog, setShowGameDialog] = useState(false);
  const [showAllGamesDialog, setShowAllGamesDialog] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  // États pour les dialogs de badges
  const [showBadgesDialog, setShowBadgesDialog] = useState(false);

  // Fonctions utilitaires pour les jeux
  const showGameDetails = (game: any) => {
    setSelectedGame(game);
    setShowGameDialog(true);
  };

  const openAllGamesDialog = () => {
    setShowAllGamesDialog(true);
  };

  const openBadgesDialog = () => {
    setShowBadgesDialog(true);
  };

  const handleGameClickInAllGamesDialog = (game: any) => {
    setShowAllGamesDialog(false);
    showGameDetails(game);
  };

  return {
    // États de base
    showSettingsDialog,
    setShowSettingsDialog,
    showEditBioDialog,
    setShowEditBioDialog,
    showAddEquipmentDialog,
    setShowAddEquipmentDialog,
    
    // États des jeux
    showGameDialog,
    setShowGameDialog,
    showAllGamesDialog,
    setShowAllGamesDialog,
    selectedGame,
    setSelectedGame,

    // États des badges
    showBadgesDialog,
    setShowBadgesDialog,

    // Fonctions utilitaires
    showGameDetails,
    openAllGamesDialog,
    openBadgesDialog,
    handleGameClickInAllGamesDialog,
  };
};
