
import { useState, useCallback } from 'react';

export const useGameDetailsDialog = () => {
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showGameDialog, setShowGameDialog] = useState(false);

  const showGameDetails = useCallback((game: any) => {
    if (!game) return;

    console.log('🎮 HOOK - useGameDetailsDialog: Received game data:', game);
    console.log('🎮 HOOK - useGameDetailsDialog: Game object keys:', Object.keys(game || {}));
    console.log('🎮 HOOK - Current route when opening dialog:', window.location.pathname);

    const enrichedGame = {
      ...game,
      // Ensure we have a valid ID field - check multiple possible field names
      id: game.id || game.game_id || game.party_id || game.gameId,
      participantsCount: game.participants ?? game.participantsCount ?? 0,
      max_players: game.maxParticipants ?? game.max_players,
      address: game.location || (game.city && game.zip_code ? `${game.city}, ${game.zip_code}` : game.address) || 'Lieu non spécifié'
    };
    
    console.log('🎮 HOOK - useGameDetailsDialog: Enriched game data:', enrichedGame);
    console.log('🎮 HOOK - useGameDetailsDialog: Final ID value:', enrichedGame.id);
    
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
