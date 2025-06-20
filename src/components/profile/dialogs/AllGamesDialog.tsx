
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatGameDate } from '@/utils/dateUtils';
import { Calendar, Clock, MapPin, Users, Euro } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AllGamesDialogProps {
  showAllGamesDialog: boolean;
  setShowAllGamesDialog: (show: boolean) => void;
  user: any;
  userGames: any[];
  onGameClick: (game: any) => void;
}

const AllGamesDialog: React.FC<AllGamesDialogProps> = ({
  showAllGamesDialog,
  setShowAllGamesDialog,
  user,
  userGames = [],
  onGameClick
}) => {
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

  // Trier les parties : à venir d'abord, puis par date
  const sortedAllGames = React.useMemo(() => {
    if (!userGames || userGames.length === 0) return [];
    return [...userGames].sort((a, b) => {
      // Parties "À venir" en premier
      if (a.status === "À venir" && b.status !== "À venir") return -1;
      if (a.status !== "À venir" && b.status === "À venir") return 1;

      // Si les deux sont à venir ou les deux sont passées, tri par date (du plus récent au plus ancien)
      const dateA = a.date.split('/').reverse().join('-'); // Convertir format FR (jj/mm/aaaa) en format ISO (aaaa-mm-jj)
      const dateB = b.date.split('/').reverse().join('-');
      return dateB > dateA ? 1 : -1;
    });
  }, [userGames]);

  const content = (
    <div className="space-y-4 py-4">
      {sortedAllGames.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          Vous n'avez pas encore participé à des parties.
        </p>
      ) : (
        sortedAllGames.map(game => (
          <div key={game.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-base mb-2 pr-2 flex-1">{game.title}</h3>
                <Badge className={`${
                  game.status === 'À venir' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : game.status === 'En cours'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                } flex-shrink-0`}>
                  {game.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>{formatGameDateDisplay(game)}</span>
                </div>
                {game.time && (
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>{game.time}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <span className="break-words">{game.location || 'Lieu non spécifié'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} />
                  <span>{game.participants || 0}/{game.maxParticipants || '?'} participants</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Rôle:</span>
                  <span>{game.role || 'Participant'}</span>
                </div>
                {game.price !== undefined && game.price !== null && (
                  <div className="flex items-center gap-2">
                    <Euro size={14} />
                    <span>{game.price}€</span>
                  </div>
                )}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="border-airsoft-red text-airsoft-red hover:bg-airsoft-red hover:text-white w-full mt-2" 
                onClick={() => onGameClick(game)}
              >
                Voir les détails
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={showAllGamesDialog} onOpenChange={setShowAllGamesDialog}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle>Toutes les parties de {user?.username || 'l\'utilisateur'}</DrawerTitle>
            <DrawerDescription>
              {sortedAllGames.length} parties au total
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-4">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={showAllGamesDialog} onOpenChange={setShowAllGamesDialog}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Toutes les parties de {user?.username || 'l\'utilisateur'}</DialogTitle>
          <DialogDescription>
            {sortedAllGames.length} parties au total
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default AllGamesDialog;
