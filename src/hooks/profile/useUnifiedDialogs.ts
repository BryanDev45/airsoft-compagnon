
import { useState, useCallback } from 'react';

export const useUnifiedDialogs = () => {
  // States pour les dialogs de profil
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showEditBioDialog, setShowEditBioDialog] = useState(false);
  const [showAddEquipmentDialog, setShowAddEquipmentDialog] = useState(false);
  const [showAllGamesDialog, setShowAllGamesDialog] = useState(false);
  const [showBadgesDialog, setShowBadgesDialog] = useState(false);
  
  // States pour les détails de jeu
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showGameDialog, setShowGameDialog] = useState(false);

  const showGameDetails = useCallback((game: any) => {
    if (!game) return;

    const enrichedGame = {
      ...game,
      participantsCount: game.participants ?? game.participantsCount ?? 0,
      max_players: game.maxParticipants ?? game.max_players,
      address: game.location || (game.city && game.zip_code ? `${game.city}, ${game.zip_code}` : game.address) || 'Lieu non spécifié'
    };
    
    setSelectedGame(enrichedGame);
    setShowGameDialog(true);
  }, []);

  const closeGameDialog = useCallback(() => {
    setShowGameDialog(false);
    setSelectedGame(null);
  }, []);

  const closeAllGamesDialog = useCallback(() => {
    setShowAllGamesDialog(false);
  }, []);

  const openAllGamesDialog = useCallback(() => {
    setShowAllGamesDialog(true);
  }, []);

  const openBadgesDialog = useCallback(() => {
    setShowBadgesDialog(true);
  }, []);

  const handleGameClickInAllGamesDialog = useCallback((game: any) => {
    setShowAllGamesDialog(false);
    showGameDetails(game);
  }, [showGameDetails]);

  return {
    // Profile dialogs
    showSettingsDialog,
    setShowSettingsDialog,
    showEditBioDialog,
    setShowEditBioDialog,
    showAddEquipmentDialog,
    setShowAddEquipmentDialog,
    showAllGamesDialog,
    setShowAllGamesDialog,
    showBadgesDialog,
    setShowBadgesDialog,
    
    // Game dialogs
    selectedGame,
    showGameDialog,
    setShowGameDialog,
    showGameDetails,
    closeGameDialog,
    closeAllGamesDialog,
    openAllGamesDialog,
    openBadgesDialog,
    handleGameClickInAllGamesDialog
  };
};
