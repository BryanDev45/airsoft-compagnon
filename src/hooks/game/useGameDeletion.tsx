
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/useAuth';

export const useGameDeletion = (gameData: any, id: string | undefined) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deletingGame, setDeletingGame] = useState(false);

  const isUserAdmin = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase.rpc('is_current_user_admin');
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      return data || false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  const handleDeleteGame = async () => {
    if (!user || !id || !gameData) return;
    
    const userIsAdmin = await isUserAdmin();
    const isCreator = user.id === gameData.created_by;
    
    if (!isCreator && !userIsAdmin) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous n'êtes pas autorisé à supprimer cette partie."
      });
      return;
    }
    
    try {
      setDeletingGame(true);
      console.log('Attempting to delete game:', id, 'User is admin:', userIsAdmin, 'Is creator:', isCreator);
      
      // Supprimer d'abord les participants
      const { error: participantsError } = await supabase
        .from('game_participants')
        .delete()
        .eq('game_id', id);
      
      if (participantsError) {
        console.error('Error deleting participants:', participantsError);
        throw participantsError;
      }
      
      // Supprimer les commentaires
      const { error: commentsError } = await supabase
        .from('game_comments')
        .delete()
        .eq('game_id', id);
        
      if (commentsError) {
        console.error('Error deleting comments:', commentsError);
        throw commentsError;
      }
      
      // Supprimer la partie
      const { error: gameError } = await supabase
        .from('airsoft_games')
        .delete()
        .eq('id', id);
        
      if (gameError) {
        console.error('Error deleting game:', gameError);
        throw gameError;
      }
      
      console.log('Successfully deleted game');
      
      toast({
        title: "Partie supprimée",
        description: "La partie a été supprimée avec succès."
      });
      
      navigate('/parties');
      
    } catch (error) {
      console.error('Error deleting game:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la partie. Veuillez réessayer."
      });
    } finally {
      setDeletingGame(false);
    }
  };

  return {
    deletingGame,
    handleDeleteGame,
    isUserAdmin
  };
};
