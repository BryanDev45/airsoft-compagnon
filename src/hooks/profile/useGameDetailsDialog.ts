
import { useState, useCallback } from 'react';

export const useGameDetailsDialog = () => {
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showGameDialog, setShowGameDialog] = useState(false);

  const showGameDetails = useCallback((game: any) => {
    if (!game) return;

    console.log('useGameDetailsDialog: Received game data:', game);

    const enrichedGame = {
      ...game,
      // Ensure we have a valid ID field - check multiple possible field names
      id: game.id || game.game_id || game.party_id,
      participantsCount: game.participants ?? game.participantsCount ?? 0,
      max_players: game.maxParticipants ?? game.max_players,
      address: game.location || (game.city && game.zip_code ? `${game.city}, ${game.zip_code}` : game.address) || 'Lieu non spécifié'
    };
    
    console.log('useGameDetailsDialog: Enriched game data:', enrichedGame);
    
    setSelectedGame(enrichedGame);
    setShowGameDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setShowGameDialog(false);
    setSelectedGame(null);
  }, []);

  return {
    selectedGame,
    showGameDialog,
    showGameDetails,
    setShowGameDialog,
    handleCloseDialog
  };
};
