
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/useAuth';

export const useGameActions = (gameData: any, id: string | undefined, loadParticipants: () => void) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingRegistration, setLoadingRegistration] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [deletingGame, setDeletingGame] = useState(false);

  const handleRegistration = async (isRegistered: boolean) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!gameData) return;
    
    try {
      setLoadingRegistration(true);
      
      if (isRegistered) {
        setShowRegistrationDialog(true);
      } else {
        const { error } = await supabase
          .from('game_participants')
          .insert({
            game_id: id,
            user_id: user.id,
            role: 'Participant',
            status: 'Confirmé'
          });
          
        if (error) throw error;
        
        toast({
          title: "Inscription réussie",
          description: "Vous êtes maintenant inscrit à cette partie."
        });
        
        await loadParticipants();
      }
    } catch (error) {
      console.error('Error with registration:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de traiter votre inscription."
      });
    } finally {
      setLoadingRegistration(false);
    }
  };

  const handleUnregister = async () => {
    if (!user || !id) return;
    
    try {
      setLoadingRegistration(true);
      
      const { error } = await supabase
        .from('game_participants')
        .delete()
        .eq('game_id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Désinscription réussie",
        description: "Vous avez été désinscrit de cette partie."
      });
      
      setShowRegistrationDialog(false);
      await loadParticipants();
      
    } catch (error) {
      console.error('Error unregistering:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vous désinscrire de cette partie."
      });
    } finally {
      setLoadingRegistration(false);
    }
  };

  const handleDeleteGame = async () => {
    if (!user || !id || !gameData || user.id !== gameData.created_by) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous n'êtes pas autorisé à supprimer cette partie."
      });
      return;
    }
    
    try {
      setDeletingGame(true);
      
      const { error: participantsError } = await supabase
        .from('game_participants')
        .delete()
        .eq('game_id', id);
      
      if (participantsError) throw participantsError;
      
      const { error: commentsError } = await supabase
        .from('game_comments')
        .delete()
        .eq('game_id', id);
        
      if (commentsError) throw commentsError;
      
      const { error: gameError } = await supabase
        .from('airsoft_games')
        .delete()
        .eq('id', id);
        
      if (gameError) throw gameError;
      
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
    loadingRegistration,
    showShareDialog,
    setShowShareDialog,
    showRegistrationDialog,
    setShowRegistrationDialog,
    deletingGame,
    handleRegistration,
    handleUnregister,
    handleDeleteGame
  };
};
