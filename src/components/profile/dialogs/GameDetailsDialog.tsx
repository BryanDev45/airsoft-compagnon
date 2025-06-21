import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatGameDate } from '@/utils/dateUtils';
import { Calendar, Clock, MapPin, Users, Euro } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface GameDetailsDialogProps {
  selectedGame: any;
  showGameDialog: boolean;
  setShowGameDialog: (show: boolean) => void;
}

const GameDetailsDialog: React.FC<GameDetailsDialogProps> = ({
  selectedGame,
  showGameDialog,
  setShowGameDialog
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const formatGameDateDisplay = (game: any) => {
    if (!game) {
      console.warn('Game object is missing:', game);
      return 'Date non disponible';
    }
    
    console.log('Game object for date formatting:', game);
    
    const startDate = game.date || game.rawDate;
    const endDate = game.end_date;
    
    if (!startDate) {
      console.warn('No valid start date found in game object:', game);
      return 'Date non disponible';
    }
    
    try {
      return formatGameDate(startDate, endDate);
    } catch (error) {
      console.error('Error formatting game date:', error, { startDate, endDate, game });
      return 'Date non disponible';
    }
  };

  const handleViewGameDetails = () => {
    console.log('🎮 GAME DIALOG - Full game object received:', selectedGame);
    console.log('🎮 GAME DIALOG - Object keys available:', Object.keys(selectedGame || {}));
    console.log('🎮 GAME DIALOG - Current route:', window.location.pathname);
    
    // Check multiple possible ID fields to handle different data structures
    const gameId = selectedGame?.id || selectedGame?.game_id || selectedGame?.party_id || selectedGame?.gameId;
    
    console.log('🎮 GAME DIALOG - ID check results:', {
      'selectedGame.id': selectedGame?.id,
      'selectedGame.game_id': selectedGame?.game_id,
      'selectedGame.party_id': selectedGame?.party_id,
      'selectedGame.gameId': selectedGame?.gameId,
      'final gameId': gameId
    });
    
    if (!gameId) {
      console.error('🚨 GAME DIALOG - No game ID available for navigation');
      console.error('🚨 GAME DIALOG - Available fields:', Object.keys(selectedGame || {}));
      console.error('🚨 GAME DIALOG - Full selected game object:', selectedGame);
      
      // Show a more helpful error to the user
      alert('Erreur: Impossible de trouver l\'ID de la partie. Veuillez rafraîchir la page et réessayer.');
      return;
    }
    
    console.log('✅ GAME DIALOG - Navigating to game details with ID:', gameId);
    console.log('✅ GAME DIALOG - Navigation URL will be:', `/game/${gameId}`);
    
    // Fermer la dialog d'abord
    setShowGameDialog(false);
    
    // Naviguer vers la page de détails de la partie
    navigate(`/game/${gameId}`);
  };

  console.log("🎮 GAME DIALOG - Selected game in dialog:", selectedGame);

  if (!selectedGame) {
    return null;
  }

  const DetailsContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="text-airsoft-red flex-shrink-0" size={18} />
          <span className="font-medium">{formatGameDateDisplay(selectedGame)}</span>
        </div>
        
        {selectedGame.time && (
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="text-airsoft-red flex-shrink-0" size={18} />
            <span>{selectedGame.time}</span>
          </div>
        )}
        
        <div className="flex items-start gap-2 text-gray-700">
          <MapPin className="text-airsoft-red flex-shrink-0" size={18} />
          <div>
            <p>{selectedGame.address || selectedGame.location || 'Lieu non spécifié'}</p>
            {selectedGame.zip_code && (
              <p>{selectedGame.zip_code}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-gray-700">
          <Users className="text-airsoft-red flex-shrink-0" size={18} />
          <span>
            <span className="font-medium">
              {selectedGame.participants !== undefined 
                ? selectedGame.participants 
                : (selectedGame.participantsCount !== undefined ? selectedGame.participantsCount : 0)
              }
            </span>
            <span className="text-gray-500">
              /{selectedGame.maxParticipants || selectedGame.max_players || '?'}
            </span> participants
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-700">
          <Euro className="text-airsoft-red flex-shrink-0" size={18} />
          <span>
            {selectedGame.price !== undefined && selectedGame.price !== null 
              ? `${selectedGame.price}€` 
              : 'Prix non spécifié'}
          </span>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <Badge className={`${
            selectedGame.status === 'À venir' 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gray-600 hover:bg-gray-700'
          }`}>
            {selectedGame.status}
          </Badge>
        </div>
        
        <div className="border-t border-gray-200 pt-3 mt-2">
          <p className="font-medium">Votre rôle : <span className="font-normal">{selectedGame.role}</span></p>
          {selectedGame.team && selectedGame.team !== 'Indéfini' && (
            <p className="font-medium mt-1">Équipe : <span className="font-normal">{selectedGame.team}</span></p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleViewGameDetails}
          className="bg-airsoft-red hover:bg-red-700 w-full sm:w-auto"
          type="button"
        >
          Voir la partie
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={showGameDialog} onOpenChange={setShowGameDialog}>
        <DrawerContent className="p-4">
          <DrawerHeader className="p-0 text-left mb-4">
            <DrawerTitle className="text-xl font-bold text-airsoft-dark">{selectedGame.title}</DrawerTitle>
            <DrawerDescription className="text-gray-600">
              Détails de la partie
            </DrawerDescription>
          </DrawerHeader>
          <DetailsContent />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={showGameDialog} onOpenChange={setShowGameDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-airsoft-dark">{selectedGame.title}</DialogTitle>
          <DialogDescription className="text-gray-600">
            Détails de la partie
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <DetailsContent />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameDetailsDialog;
