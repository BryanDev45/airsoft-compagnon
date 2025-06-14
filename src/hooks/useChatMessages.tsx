
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  created_at: string;
  is_deleted: boolean;
}

interface ConversationDetails {
  id: string;
  type: 'direct' | 'team';
  name?: string;
}

export const useChatMessages = (conversationId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Récupérer les détails de la conversation
  const { data: conversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async (): Promise<ConversationDetails | null> => {
      const { data, error } = await supabase
        .from('conversations')
        .select('id, type, name')
        .eq('id', conversationId)
        .single();

      if (error) {
        console.error('Error fetching conversation:', error);
        return null;
      }

      return {
        id: data.id,
        type: data.type as 'direct' | 'team',
        name: data.name
      };
    },
    enabled: !!conversationId,
  });

  // Récupérer les messages de la conversation
  const { data: messages = [] } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async (): Promise<Message[]> => {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          sender_id,
          created_at,
          is_deleted
        `)
        .eq('conversation_id', conversationId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      if (!messagesData || messagesData.length === 0) {
        return [];
      }

      // Récupérer les informations des expéditeurs
      const senderIds = [...new Set(messagesData.map(m => m.sender_id))];
      const { data: sendersData } = await supabase
        .from('profiles')
        .select('id, username, avatar')
        .in('id', senderIds);

      const sendersMap = new Map(sendersData?.map(s => [s.id, s]) || []);

      return messagesData.map(message => {
        const sender = sendersMap.get(message.sender_id);
        return {
          ...message,
          sender_name: sender?.username || 'Utilisateur',
          sender_avatar: sender?.avatar
        };
      });
    },
    enabled: !!conversationId,
    refetchInterval: 5000, // Rafraîchir toutes les 5 secondes
  });

  // Envoyer un message
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

  // Marquer les messages comme lus avec callback pour retour
  const markAsRead = async () => {
    if (!user?.id || !conversationId) {
      console.log('Missing user ID or conversation ID for markAsRead');
      return;
    }

    console.log('Marking messages as read for conversation:', conversationId);

    try {
      const { error } = await supabase
        .from('conversation_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error marking messages as read:', error);
      } else {
        console.log('Successfully marked messages as read');
        
        // Invalider immédiatement les requêtes pour forcer la mise à jour
        await queryClient.invalidateQueries({ queryKey: ['conversations'] });
        await queryClient.invalidateQueries({ queryKey: ['unreadNotifications', user.id] });
        
        // Refetch les conversations pour mettre à jour les compteurs
        await queryClient.refetchQueries({ queryKey: ['conversations', user.id] });
        
        // Callback pour notifier le hook parent que le marquage a été effectué
        if (markAsReadCallback) {
          markAsReadCallback();
        }
      }
    } catch (error) {
      console.error('Error in markAsRead:', error);
    }
  };

  return {
    messages,
    conversation,
    sendMessage,
    markAsRead
  };
};
