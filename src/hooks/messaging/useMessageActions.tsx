
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export const useMessageActions = (conversationId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const sendMessage = async (content: string) => {
    if (!user?.id || !conversationId) {
      throw new Error('Utilisateur ou conversation non trouvé');
    }

    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content
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

    // Mettre à jour la dernière activité de la conversation
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    // Invalider et rafraîchir les messages et conversations
    queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  };

  const markAsRead = async () => {
    if (!user?.id || !conversationId) {
      console.log('Missing user ID or conversation ID for markAsRead');
      return;
    }

    console.log('Marking messages as read for conversation:', conversationId);

    try {
      // Utiliser la nouvelle fonction pour marquer tous les messages de la conversation comme lus
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
        await queryClient.invalidateQueries({ queryKey: ['unreadNotifications', user.id] });
        
        // Refetch les conversations pour mettre à jour les compteurs
        await queryClient.refetchQueries({ queryKey: ['conversations', user.id] });
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
