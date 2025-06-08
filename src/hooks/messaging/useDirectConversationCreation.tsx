
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

      // Vérifier d'abord si une conversation directe existe déjà
      const { data: existingConversations, error: checkError } = await supabase
        .from('conversations')
        .select(`
          id,
          conversation_participants!inner(user_id)
        `)
        .eq('type', 'direct');

      if (checkError) {
        console.error('Erreur lors de la vérification des conversations existantes:', checkError);
        throw checkError;
      }

      // Chercher une conversation directe existante entre ces deux utilisateurs
      let conversationId = null;
      
      if (existingConversations) {
        for (const conv of existingConversations) {
          const participantIds = conv.conversation_participants.map(p => p.user_id);
          if (participantIds.includes(user.id) && participantIds.includes(targetUserId) && participantIds.length === 2) {
            conversationId = conv.id;
            break;
          }
        }
      }

      // Si aucune conversation existante, en créer une nouvelle
      if (!conversationId) {
        console.log('Création d\'une nouvelle conversation directe');
        
        // Créer la conversation
        const { data: newConversation, error: conversationError } = await supabase
          .from('conversations')
          .insert({
            type: 'direct'
          })
          .select('id')
          .single();

        if (conversationError) {
          console.error('Erreur lors de la création de la conversation:', conversationError);
          throw conversationError;
        }

        conversationId = newConversation.id;

        // Ajouter les participants
        const { error: participantsError } = await supabase
          .from('conversation_participants')
          .insert([
            { conversation_id: conversationId, user_id: user.id },
            { conversation_id: conversationId, user_id: targetUserId }
          ]);

        if (participantsError) {
          console.error('Erreur lors de l\'ajout des participants:', participantsError);
          throw participantsError;
        }

        console.log('Nouvelle conversation créée avec succès:', conversationId);
      } else {
        console.log('Conversation existante trouvée:', conversationId);
      }

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
