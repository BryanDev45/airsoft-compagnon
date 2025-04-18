
import React from 'react';
import { Map, Calendar as CalendarIcon, Clock, Users, Trophy, Flag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

interface ProfileDialogsProps {
  selectedGame: any;
  showGameDialog: boolean;
  setShowGameDialog: (show: boolean) => void;
  showAllGamesDialog: boolean;
  setShowAllGamesDialog: (show: boolean) => void;
  showBadgesDialog: boolean;
  setShowBadgesDialog: (show: boolean) => void;
  handleNavigateToGame?: (gameId: number) => void;
  user: any;
}

const ProfileDialogs = ({ 
  selectedGame, 
  showGameDialog, 
  setShowGameDialog, 
  showAllGamesDialog, 
  setShowAllGamesDialog, 
  showBadgesDialog, 
  setShowBadgesDialog, 
  handleNavigateToGame = () => {}, 
  user 
}: ProfileDialogsProps) => {
  // Ajout d'une vérification pour s'assurer que user n'est pas null
  if (!user) {
    return null;
  }

  return (
    <>
      <Dialog open={showGameDialog} onOpenChange={setShowGameDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{selectedGame?.title || 'Détails de la partie'}</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Détails de la partie
            </DialogDescription>
          </DialogHeader>
          
          {selectedGame && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <Badge 
                  className={
                    selectedGame.status === "À venir" 
                      ? "bg-blue-500" 
                      : selectedGame.status === "Terminé" 
                      ? "bg-gray-500" 
                      : "bg-green-500"
                  }
                >
                  {selectedGame.status || 'Inconnu'}
                </Badge>
                <span className="text-sm font-medium">{selectedGame.role || '-'}</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarIcon size={16} className="text-airsoft-red" />
                  <span>{selectedGame.date || 'Date non spécifiée'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-airsoft-red" />
                  <span>Durée: {selectedGame.duration || 'Non spécifiée'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Map size={16} className="text-airsoft-red" />
                  <span>{selectedGame.location ? selectedGame.location.split(',')[0] : 'Lieu non spécifié'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-airsoft-red" />
                  <span>{selectedGame.participants || 0} participants</span>
                </div>
              </div>
              
              <div className="mt-2">
                <h4 className="font-medium text-sm mb-1">Description:</h4>
                <p className="text-sm text-gray-600">{selectedGame.description || 'Aucune description disponible'}</p>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button 
                  className="bg-airsoft-red hover:bg-red-700"
                  onClick={() => handleNavigateToGame(selectedGame.id)}
                >
                  Voir la page complète
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={showAllGamesDialog} onOpenChange={setShowAllGamesDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Toutes mes parties</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Historique complet de vos participations
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 max-h-96 overflow-y-auto pr-2">
            <div className="space-y-4">
              {/* Utilisation d'une vérification pour les propriétés games et allGames */}
              {[...(user.games || []), ...(user.allGames || [])].map(game => (
                <div 
                  key={game.id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{game.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <CalendarIcon size={14} /> {game.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} /> {game.role}
                        </span>
                        <span className="flex items-center gap-1">
                          <Map size={14} /> {game.location ? game.location.split(',')[0] : 'Lieu inconnu'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <Badge 
                        className={
                          game.status === "À venir" 
                            ? "bg-blue-500" 
                            : game.status === "Terminé" 
                            ? "bg-gray-500" 
                            : "bg-green-500"
                        }
                      >
                        {game.status || 'Inconnu'}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-airsoft-red text-airsoft-red hover:bg-airsoft-red hover:text-white"
                        onClick={() => {
                          setShowAllGamesDialog(false);
                          setShowGameDialog(true); 
                          handleNavigateToGame(game.id);
                        }}
                      >
                        Détails
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showBadgesDialog} onOpenChange={setShowBadgesDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Badge className="text-airsoft-red">
                <Trophy size={20} />
              </Badge>
              Mes badges
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Badges et accomplissements débloqués
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 max-h-96 overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(user.badges || []).map((badge) => (
                <div 
                  key={badge.id}
                  className="border rounded-lg p-4 flex items-center gap-3"
                  style={{ 
                    backgroundColor: badge.backgroundColor,
                    borderColor: badge.borderColor
                  }}
                >
                  <img 
                    src={badge.icon} 
                    alt={badge.name} 
                    className="w-14 h-14"
                  />
                  <div>
                    <h3 className="font-semibold">{badge.name}</h3>
                    <p className="text-xs text-gray-600 mb-1">{badge.description}</p>
                    <p className="text-xs text-gray-500">Obtenu le {badge.date}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium mb-3">Badges à débloquer</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-60">
                <div className="border rounded-lg p-4 flex items-center gap-3 bg-gray-100">
                  <div className="w-14 h-14 bg-gray-300 flex items-center justify-center rounded-full">
                    <Trophy size={24} className="text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Champion</h3>
                    <p className="text-xs text-gray-600">Gagner 10 parties consécutives</p>
                    <p className="text-xs text-gray-500">Progression: 4/10</p>
                  </div>
                </div>
                <div className="border rounded-lg p-4 flex items-center gap-3 bg-gray-100">
                  <div className="w-14 h-14 bg-gray-300 flex items-center justify-center rounded-full">
                    <Flag size={24} className="text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Capture de drapeaux</h3>
                    <p className="text-xs text-gray-600">Capturer 100 drapeaux</p>
                    <p className="text-xs text-gray-500">Progression: 53/100</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileDialogs;
