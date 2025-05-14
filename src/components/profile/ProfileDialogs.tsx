import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Clock, MapPin } from 'lucide-react';

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
              <DialogTitle>{selectedGame.title}</DialogTitle>
              <DialogDescription>
                Détails de la partie
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="text-gray-500" size={16} />
                <span>{formatGameDate(selectedGame.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-gray-500" size={16} />
                <span>{selectedGame.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={selectedGame.status === 'À venir' ? 'bg-green-600' : 'bg-gray-600'}>
                  {selectedGame.status}
                </Badge>
              </div>
              <div className="pt-2">
                <p><strong>Rôle :</strong> {selectedGame.role}</p>
                {selectedGame.team && selectedGame.team !== 'Indéfini' && (
                  <p><strong>Équipe :</strong> {selectedGame.team}</p>
                )}
              </div>
              <div className="pt-4 flex justify-end">
                <Button onClick={() => {
                  setShowGameDialog(false);
                  if (selectedGame.id) {
                    handleNavigateToGame(selectedGame.id);
                  }
                }}>
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
