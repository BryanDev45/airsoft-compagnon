
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

    if (!content.trim()) {
      throw new Error('Le message ne peut pas être vide');
    }

    console.log('Sending message:', { content, conversationId, senderId: user.id });

    try {
      // Send the message - RLS will handle access control
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim()
        });

      if (error) {
        console.error('Error sending message:', error);
        
        // Show user-friendly error message
        if (error.message.includes('permission denied') || 
            error.message.includes('row-level security')) {
          toast({
            title: "Erreur",
            description: "Vous n'êtes pas autorisé à envoyer des messages dans cette conversation",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erreur",
            description: "Impossible d'envoyer le message",
            variant: "destructive"
          });
        }
        throw error;
      }

      console.log('Message sent successfully');

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      // Invalidate and refresh caches
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['optimized-conversations'] });

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
      // Use the function to mark all messages in the conversation as read
      const { error } = await supabase.rpc('mark_conversation_messages_as_read', {
        p_conversation_id: conversationId,
        p_user_id: user.id
      });

      if (error) {
        console.error('Error marking messages as read:', error);
      } else {
        console.log('Successfully marked messages as read');
        
        // Invalidate queries to force update
        await queryClient.invalidateQueries({ queryKey: ['conversations'] });
        await queryClient.invalidateQueries({ queryKey: ['optimized-conversations'] });
        await queryClient.invalidateQueries({ queryKey: ['unreadNotifications', user.id] });
        
        // Refetch conversations to update counters
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
