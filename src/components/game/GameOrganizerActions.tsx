
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GameOrganizerActionsProps {
  gameId: string;
  gameDate: string;
  isGamePassed: boolean;
}

const GameOrganizerActions: React.FC<GameOrganizerActionsProps> = ({ gameId, gameDate, isGamePassed }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    navigate(`/edit-game/${gameId}`);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      // Supprimer les inscriptions liées à cette partie
      await supabase
        .from('game_participants')
        .delete()
        .eq('game_id', gameId);

      // Supprimer la partie elle-même
      const { error } = await supabase
        .from('airsoft_games')
        .delete()
        .eq('id', gameId);

      if (error) throw error;

      toast({
        title: "Partie supprimée",
        description: "La partie a été supprimée avec succès",
      });
      
      navigate('/parties');
    } catch (error: any) {
      console.error("Erreur lors de la suppression :", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la partie",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Désactiver les actions si la partie est déjà passée
  if (isGamePassed) {
    return null;
  }

  return (
    <>
      <div className="flex gap-2">
        <Button onClick={handleEdit} variant="outline" size="sm">
          <Edit2 size={16} className="mr-2" />
          Modifier
        </Button>
        <Button 
          onClick={() => setIsDeleteDialogOpen(true)} 
          variant="destructive"
          size="sm"
        >
          <Trash2 size={16} className="mr-2" />
          Supprimer
        </Button>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette partie ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible et supprimera définitivement cette partie ainsi que toutes les inscriptions associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                  Suppression...
                </span>
              ) : (
                "Confirmer la suppression"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GameOrganizerActions;
