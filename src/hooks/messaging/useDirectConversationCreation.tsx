
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
      // Vérifier si une conversation directe existe déjà entre les deux utilisateurs
      const { data: existingConversations, error: checkError } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          conversations!inner(
            id,
            type
          )
        `)
        .eq('user_id', user.id);

      if (checkError) {
        console.error('Error checking existing conversations:', checkError);
        throw checkError;
      }

      // Filtrer les conversations directes où l'autre utilisateur participe aussi
      let existingConversationId = null;
      
      if (existingConversations && existingConversations.length > 0) {
        const directConversations = existingConversations.filter(
          conv => conv.conversations?.type === 'direct'
        );

        for (const conv of directConversations) {
          const { data: otherParticipants, error: participantsError } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', conv.conversation_id)
            .neq('user_id', user.id);

          if (!participantsError && otherParticipants) {
            const hasTargetUser = otherParticipants.some(p => p.user_id === targetUserId);
            if (hasTargetUser && otherParticipants.length === 1) {
              existingConversationId = conv.conversation_id;
              break;
            }
          }
        }
      }

      if (existingConversationId) {
        // Rediriger vers la conversation existante
        navigate('/messages');
        toast({
          title: "Conversation trouvée",
          description: `Conversation existante avec ${targetUsername} ouverte`,
        });
        setIsCreating(false);
        return;
      }

      // Créer une nouvelle conversation directe
      const { data: newConversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          type: 'direct'
        })
        .select('id')
        .single();

      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
        throw conversationError;
      }

      // Ajouter les deux participants à la conversation
      const participants = [
        {
          conversation_id: newConversation.id,
          user_id: user.id
        },
        {
          conversation_id: newConversation.id,
          user_id: targetUserId
        }
      ];

      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert(participants);

      if (participantsError) {
        console.error('Error adding participants:', participantsError);
        throw participantsError;
      }

      // Rediriger vers la page des messages
      navigate('/messages');
      
      toast({
        title: "Conversation créée",
        description: `Nouvelle conversation avec ${targetUsername} créée`,
      });

    } catch (error) {
      console.error('Error creating direct conversation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la conversation",
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
