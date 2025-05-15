
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Clock, MapPin, Users, Euro } from 'lucide-react';

const ProfileDialogs = ({ 
  selectedGame,
  showGameDialog,
  setShowGameDialog,
  showAllGamesDialog,
  setShowAllGamesDialog,
  showBadgesDialog,
  setShowBadgesDialog,
  handleNavigateToGame,
  user
}) => {
  // Formatage de la date pour l'affichage
  const formatGameDate = (dateString) => {
    if (!dateString) return '';
    
    // Si dateString est déjà formaté comme "dd/mm/yyyy", on le laisse tel quel
    if (dateString.includes('/')) return dateString;
    
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch (e) {
      console.error("Erreur de formatage de date:", e);
      return dateString;
    }
  };
  
  return (
    <>
      {/* Dialog pour afficher les détails d'une partie */}
      {selectedGame && (
        <Dialog open={showGameDialog} onOpenChange={setShowGameDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-airsoft-dark">{selectedGame.title}</DialogTitle>
              <DialogDescription className="text-gray-600">
                Détails de la partie
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="text-airsoft-red flex-shrink-0" size={18} />
                  <span className="font-medium">{formatGameDate(selectedGame.date)}</span>
                </div>
                
                {selectedGame.time && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="text-airsoft-red flex-shrink-0" size={18} />
                    <span>{selectedGame.time}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="text-airsoft-red flex-shrink-0" size={18} />
                  <span>{selectedGame.location || 'Lieu non spécifié'}</span>
                </div>
                
                {selectedGame.address && (
                  <div className="flex items-start gap-2 text-gray-700">
                    <MapPin className="text-airsoft-red mt-1 flex-shrink-0" size={18} />
                    <div>
                      <p>{selectedGame.address}</p>
                      {selectedGame.zip_code && selectedGame.city && (
                        <p>{selectedGame.zip_code} {selectedGame.city}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {(selectedGame.max_players !== undefined || selectedGame.participantsCount !== undefined) && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="text-airsoft-red flex-shrink-0" size={18} />
                    <span>
                      <span className="font-medium">{selectedGame.participantsCount || '0'}</span>
                      <span className="text-gray-500">/{selectedGame.max_players || '?'}</span> participants
                    </span>
                  </div>
                )}
                
                {selectedGame.price !== undefined && selectedGame.price !== null && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Euro className="text-airsoft-red flex-shrink-0" size={18} />
                    <span>
                      {selectedGame.price === 0 ? 'Gratuit' : `${selectedGame.price}€`}
                    </span>
                  </div>
                )}
                
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
                  onClick={() => {
                    setShowGameDialog(false);
                    if (selectedGame.id) {
                      handleNavigateToGame(selectedGame.id);
                    }
                  }}
                  className="bg-airsoft-red hover:bg-red-700"
                >
                  Voir la partie
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog pour afficher toutes les parties */}
      <Dialog open={showAllGamesDialog} onOpenChange={setShowAllGamesDialog}>
        <DialogContent className="sm:max-w-lg max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Toutes les parties de {user?.username || 'l\'utilisateur'}</DialogTitle>
          </DialogHeader>
          <div className="p-2">
            {/* Implementing this would require passing games to this component */}
            <p>Fonctionnalité à venir.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour afficher tous les badges */}
      <Dialog open={showBadgesDialog} onOpenChange={setShowBadgesDialog}>
        <DialogContent className="sm:max-w-lg max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tous les badges de {user?.username || 'l\'utilisateur'}</DialogTitle>
          </DialogHeader>
          <div className="p-2">
            {/* Implementing this would require passing badges to this component */}
            <p>Fonctionnalité à venir.</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileDialogs;
