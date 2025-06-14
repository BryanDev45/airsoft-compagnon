
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/messaging';
import { useCallback } from 'react';

export const useMessagesData = (conversationId: string) => {
  const queryFn = useCallback(async (): Promise<Message[]> => {
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

    // Récupérer les informations des expéditeurs de manière optimisée
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
  }, [conversationId]);

  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn,
    enabled: !!conversationId,
    refetchInterval: 10000, // Reduced from 5s to 10s
    staleTime: 5000, // Keep messages fresh for 5 seconds
    gcTime: 60000, // 1 minute cache
    retry: 2,
    retryDelay: 1000,
  });
};
