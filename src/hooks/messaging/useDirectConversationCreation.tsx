
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

/**
 * Hook pour créer et gérer les conversations directes
 */
export const useDirectConversationCreation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const createDirectConversation = async (targetUserId: string, targetUsername: string) => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    if (user.id === targetUserId) {
      toast({
        title: "Erreur",
        description: "Vous ne pouvez pas créer une conversation avec vous-même",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    try {
      console.log('Tentative de création de conversation avec:', targetUserId, targetUsername);

      // Utiliser la fonction Supabase pour créer ou récupérer une conversation directe
      const { data: conversationId, error: createError } = await supabase
        .rpc('create_direct_conversation', {
          other_user_id: targetUserId
        });

      if (createError) {
        console.error('Erreur lors de la création/récupération de la conversation:', createError);
        throw createError;
      }

      if (!conversationId) {
        throw new Error('Aucun ID de conversation retourné');
      }

      console.log('Conversation créée/récupérée avec succès:', conversationId);

      // Rediriger vers la page des messages
      navigate('/messages');
      
      toast({
        title: "Conversation prête",
        description: `Conversation avec ${targetUsername} ouverte`,
      });

    } catch (error) {
      console.error('Erreur lors de la création de la conversation directe:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la conversation. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createDirectConversation,
    isCreating
  };
};
