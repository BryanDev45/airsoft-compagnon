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

  // Formatage de la date pour l'affichage en utilisant la fonction formatGameDate
  const formatGameDateDisplay = (game: any) => {
    if (!game) {
      console.warn('Game object is missing:', game);
      return 'Date non disponible';
    }
    
    console.log('Game object for date formatting:', game);
    
    // Utiliser la date au format ISO stockée dans game.date et game.end_date
    const startDate = game.date || game.rawDate;
    const endDate = game.end_date;
    
    if (!startDate) {
      console.warn('No valid start date found in game object:', game);
      return 'Date non disponible';
    }
    
    try {
      // Utiliser formatGameDate qui gère automatiquement les plages de dates
      return formatGameDate(startDate, endDate);
    } catch (error) {
      console.error('Error formatting game date:', error, { startDate, endDate, game });
      return 'Date non disponible';
    }
  };

  const handleViewGameDetails = (gameId: string) => {
    setShowGameDialog(false);
    navigate(`/game/${gameId}`);
  };

  // Debug pour voir le contenu de selectedGame
  console.log("Selected game in dialog:", selectedGame);

  if (!selectedGame) {
    return null;
  }

  const DetailsContent = () => (
    <>
      <div className="grid grid-cols-1 gap-4 rounded-lg sm:border-none sm:shadow-none sm:bg-transparent sm:p-0">
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
      
      <div className="flex justify-end mt-4">
        <Button 
          onClick={() => handleViewGameDetails(selectedGame.id)}
          className="bg-airsoft-red hover:bg-red-700 w-full sm:w-auto"
        >
          Voir la partie
        </Button>
      </div>
    </>
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
        <div className="space-y-4 py-4">
          <DetailsContent />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameDetailsDialog;
