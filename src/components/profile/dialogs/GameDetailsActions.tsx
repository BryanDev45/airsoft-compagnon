
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface GameDetailsActionsProps {
  selectedGame: any;
  setShowGameDialog: (show: boolean) => void;
}

const GameDetailsActions: React.FC<GameDetailsActionsProps> = ({
  selectedGame,
  setShowGameDialog
}) => {
  const navigate = useNavigate();

  const handleViewGameDetails = () => {
    console.log('🎮 GAME ACTIONS - Full game object received:', selectedGame);
    console.log('🎮 GAME ACTIONS - Object keys available:', Object.keys(selectedGame || {}));
    console.log('🎮 GAME ACTIONS - Current route:', window.location.pathname);
    
    // Vérifier tous les champs possibles pour l'ID
    const gameId = selectedGame?.id || 
                   selectedGame?.game_id || 
                   selectedGame?.party_id || 
                   selectedGame?.gameId;
    
    console.log('🎮 GAME ACTIONS - ID check results:', {
      'selectedGame.id': selectedGame?.id,
      'selectedGame.game_id': selectedGame?.game_id,
      'selectedGame.party_id': selectedGame?.party_id,
      'selectedGame.gameId': selectedGame?.gameId,
      'final gameId': gameId
    });
    
    if (!gameId) {
      console.error('🚨 GAME ACTIONS - No game ID available for navigation');
      console.error('🚨 GAME ACTIONS - Available fields:', Object.keys(selectedGame || {}));
      console.error('🚨 GAME ACTIONS - Full selected game object:', selectedGame);
      
      alert('Erreur: Impossible de trouver l\'ID de la partie. Veuillez rafraîchir la page et réessayer.');
      return;
    }
    
    console.log('✅ GAME ACTIONS - Navigating to game details with ID:', gameId);
    console.log('✅ GAME ACTIONS - Navigation URL will be:', `/game/${gameId}`);
    
    // Fermer la dialog d'abord
    setShowGameDialog(false);
    
    // Naviguer vers la page de détails de la partie
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="flex justify-end mt-6">
      <Button 
        onClick={handleViewGameDetails}
        className="bg-airsoft-red hover:bg-red-700 w-full sm:w-auto"
        type="button"
      >
        Voir la partie
      </Button>
    </div>
  );
};

export default GameDetailsActions;
