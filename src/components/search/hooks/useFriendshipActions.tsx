
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface UserResult {
  id: string;
  username: string;
  firstname: string | null;
  lastname: string | null;
  avatar: string | null;
  location: string | null;
  reputation: number | null;
  Ban?: boolean;
  ban?: boolean;
  is_verified: boolean | null;
  team_id?: string | null;
  team_name?: string | null;
  team_logo?: string | null;
  team_info?: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
}

export const useFriendshipActions = (users: UserResult[]) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [friendships, setFriendships] = useState<Record<string, string>>({});

  // Récupérer le statut d'amitié pour chaque utilisateur affiché
  useEffect(() => {
    if (!user || !users || users.length === 0) return;
    
    const fetchFriendshipStatus = async () => {
      try {
        const statusMap: Record<string, string> = {};
        
        // Pour chaque utilisateur dans les résultats, vérifier le statut d'amitié
        for (const userData of users) {
          if (userData.id === user.id) continue; // Ignorer notre propre utilisateur
          
          const { data, error } = await supabase.rpc('check_friendship_status', { 
            p_user_id: user.id, 
            p_friend_id: userData.id 
          });
          
          if (!error && data) {
            statusMap[userData.id] = data;
          } else {
            statusMap[userData.id] = 'none';
          }
        }
        
        setFriendships(statusMap);
      } catch (error) {
        console.error('Erreur lors de la récupération des statuts d\'amitié:', error);
      }
    };
    
    fetchFriendshipStatus();
  }, [user, users]);

  // Gérer l'ajout ou la suppression d'un ami
  const handleFriendAction = async (targetUserId: string, action: 'add' | 'remove') => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour effectuer cette action",
        variant: "destructive"
      });
      return;
    }

    try {
      if (action === 'add') {
        // Envoyer une demande d'ami
        const { error } = await supabase
          .from('friendships')
          .insert({
            user_id: user.id,
            friend_id: targetUserId,
            status: 'pending'
          });

        if (error) {
          console.error('Erreur lors de l\'ajout d\'ami:', error);
          toast({
            title: "Erreur",
            description: "Impossible d'envoyer la demande d'ami",
            variant: "destructive"
          });
          return;
        }
        
        // Mettre à jour l'état local
        setFriendships(prev => ({
          ...prev,
          [targetUserId]: 'pending'
        }));
        
        toast({
          title: "Succès",
          description: "Demande d'ami envoyée"
        });
      } else {
        // Supprimer l'amitié
        const { error } = await supabase
          .from('friendships')
          .delete()
          .or(`and(user_id.eq.${user.id},friend_id.eq.${targetUserId}),and(user_id.eq.${targetUserId},friend_id.eq.${user.id})`);

        if (error) {
          console.error('Erreur lors de la suppression d\'ami:', error);
          toast({
            title: "Erreur",
            description: "Impossible de supprimer l'ami",
            variant: "destructive"
          });
          return;
        }
        
        // Mettre à jour l'état local
        setFriendships(prev => {
          const newState = { ...prev };
          delete newState[targetUserId];
          return newState;
        });
        
        toast({
          title: "Succès",
          description: "Ami supprimé"
        });
      }
    } catch (error) {
      console.error('Erreur lors de la gestion d\'amitié:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  return {
    friendships,
    handleFriendAction
  };
};
