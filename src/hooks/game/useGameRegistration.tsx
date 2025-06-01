
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/useAuth';

export const useGameRegistration = (gameData: any, id: string | undefined, loadParticipants: () => void) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingRegistration, setLoadingRegistration] = useState(false);

  const handleRegistration = async (isRegistered: boolean) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!gameData || !id) return;
    
    try {
      setLoadingRegistration(true);
      console.log('Starting registration process for user:', user.id, 'game:', id, 'isRegistered:', isRegistered);
      
      if (isRegistered) {
        return { showDialog: true };
      } else {
        // Vérifier d'abord si l'utilisateur est déjà inscrit
        const { data: existingParticipation, error: checkError } = await supabase
          .from('game_participants')
          .select('id')
          .eq('game_id', id)
          .eq('user_id', user.id)
          .maybeSingle();

        if (checkError) {
          console.error('Error checking existing participation:', checkError);
          throw checkError;
        }

        if (existingParticipation) {
          console.log('User already registered, forcing data refresh');
          toast({
            title: "Déjà inscrit",
            description: "Vous êtes déjà inscrit à cette partie."
          });
          await loadParticipants();
          return { showDialog: false };
        }

        console.log('Inserting new participation');
        const { error } = await supabase
          .from('game_participants')
          .insert({
            game_id: id,
            user_id: user.id,
            role: 'Participant',
            status: 'Confirmé'
          });
          
        if (error) {
          console.error('Registration error:', error);
          throw error;
        }
        
        console.log('Registration successful, refreshing data');
        
        toast({
          title: "Inscription réussie",
          description: "Vous êtes maintenant inscrit à cette partie."
        });
        
        // Forcer le rechargement immédiat des participants
        await loadParticipants();
        return { showDialog: false };
      }
    } catch (error) {
      console.error('Error with registration:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de traiter votre inscription."
      });
      return { showDialog: false };
    } finally {
      setLoadingRegistration(false);
    }
  };

  const handleUnregister = async () => {
    if (!user || !id) return;
    
    try {
      setLoadingRegistration(true);
      console.log('Starting unregistration process for user:', user.id, 'from game:', id);
      
      const { error } = await supabase
        .from('game_participants')
        .delete()
        .eq('game_id', id)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Unregistration error:', error);
        throw error;
      }
      
      console.log('Unregistration successful, refreshing data');
      
      toast({
        title: "Désinscription réussie",
        description: "Vous avez été désinscrit de cette partie."
      });
      
      // Forcer le rechargement immédiat des participants
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

  return {
    loadingRegistration,
    handleRegistration,
    handleUnregister
  };
};
