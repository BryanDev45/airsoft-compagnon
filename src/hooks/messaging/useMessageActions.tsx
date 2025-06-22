
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export const useMessageActions = (conversationId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const sendMessage = async (content: string) => {
    if (!user?.id || !conversationId) {
      console.error('Missing user ID or conversation ID:', { userId: user?.id, conversationId });
      throw new Error('Utilisateur ou conversation non trouvé');
    }

    console.log('Sending message:', { content, conversationId, senderId: user.id });

    try {
      // Vérifier que l'utilisateur est participant de la conversation
      const { data: participantCheck, error: participantError } = await supabase
        .from('conversation_participants')
        .select('id')
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)
        .single();

      if (participantError || !participantCheck) {
        console.error('User is not a participant of this conversation:', participantError);
        toast({
          title: "Erreur",
          description: "Vous n'êtes pas autorisé à envoyer des messages dans cette conversation",
          variant: "destructive"
        });
        throw new Error('Non autorisé');
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim()
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer le message",
          variant: "destructive"
        });
        throw error;
      }

      console.log('Message sent successfully');

      // Mettre à jour la dernière activité de la conversation
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      // Invalider et rafraîchir les caches
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['optimized-conversations'] });

      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès",
      });

    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  };

  const markAsRead = async () => {
    if (!user?.id || !conversationId) {
      console.log('Missing user ID or conversation ID for markAsRead');
      return;
    }

    console.log('Marking messages as read for conversation:', conversationId);

    try {
      // Utiliser la fonction pour marquer tous les messages de la conversation comme lus
      const { error } = await supabase.rpc('mark_conversation_messages_as_read', {
        p_conversation_id: conversationId,
        p_user_id: user.id
      });

      if (error) {
        console.error('Error marking messages as read:', error);
      } else {
        console.log('Successfully marked messages as read');
        
        // Invalider immédiatement les requêtes pour forcer la mise à jour
        await queryClient.invalidateQueries({ queryKey: ['conversations'] });
        await queryClient.invalidateQueries({ queryKey: ['optimized-conversations'] });
        await queryClient.invalidateQueries({ queryKey: ['unreadNotifications', user.id] });
        
        // Refetch les conversations pour mettre à jour les compteurs
        await queryClient.refetchQueries({ queryKey: ['conversations', user.id] });
        await queryClient.refetchQueries({ queryKey: ['optimized-conversations', user.id] });
      }
    } catch (error) {
      console.error('Error in markAsRead:', error);
    }
  };

  return {
    sendMessage,
    markAsRead
  };
};
