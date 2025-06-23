
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/messaging';
import { useAuth } from '@/hooks/useAuth';
import { useCallback } from 'react';

export const useMessagesData = (conversationId: string) => {
  const { user } = useAuth();

  const queryFn = useCallback(async (): Promise<Message[]> => {
    if (!conversationId) {
      console.warn('[MessagesData] No conversation ID provided');
      return [];
    }

    if (!user?.id) {
      console.warn('[MessagesData] No user ID available');
      return [];
    }

    console.log('[MessagesData] Fetching messages for conversation:', conversationId);

    try {
      // Fetch messages directly - RLS will handle access control
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
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) {
        console.error('[MessagesData] Error fetching messages:', error);
        throw error;
      }

      if (!messagesData || messagesData.length === 0) {
        console.log('[MessagesData] No messages found');
        return [];
      }

      console.log('[MessagesData] Found messages:', messagesData.length);

      // Fetch senders info efficiently
      const senderIds = [...new Set(messagesData.map(m => m.sender_id))];
      const { data: sendersData, error: sendersError } = await supabase
        .from('profiles')
        .select('id, username, avatar')
        .in('id', senderIds);

      if (sendersError) {
        console.warn('[MessagesData] Error fetching senders:', sendersError);
      }

      const sendersMap = new Map(sendersData?.map(s => [s.id, s]) || []);

      const messages = messagesData.map(message => {
        const sender = sendersMap.get(message.sender_id);
        return {
          ...message,
          sender_name: sender?.username || 'Utilisateur',
          sender_avatar: sender?.avatar
        };
      });

      console.log('[MessagesData] Processed messages:', messages.length);
      return messages;
    } catch (error) {
      console.error('[MessagesData] Query failed:', error);
      throw error;
    }
  }, [conversationId, user?.id]);

  return useQuery<Message[], Error>({
    queryKey: ['messages', conversationId],
    queryFn,
    enabled: !!conversationId && !!user?.id,
    staleTime: 30000,
    gcTime: 180000,
    refetchInterval: false,
    retry: (failureCount, error) => {
      // Don't retry permission errors
      if (error?.message?.includes('permission denied') || 
          error?.message?.includes('row-level security')) {
        return false;
      }
      return failureCount < 2;
    },
  });
};
