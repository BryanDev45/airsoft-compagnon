
import { useState, useCallback } from 'react';

export const useGameDetailsDialog = () => {
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

  const handleOpenChange = (isOpen: boolean) => {
      setShowGameDialog(isOpen);
      if (!isOpen) {
          // Attendre un peu avant de vider les données pour que l'animation de fermeture se termine
          setTimeout(() => setSelectedGame(null), 300);
      }
  }

  return {
    selectedGame,
    showGameDialog,
    showGameDetails,
    handleOpenChange
  };
};
