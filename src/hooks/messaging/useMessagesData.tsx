
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/messaging';
import { useOptimizedQueries } from './useOptimizedQueries';
import { useCallback } from 'react';

export const useMessagesData = (conversationId: string) => {
  const { optimizedQueryConfig } = useOptimizedQueries();

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
    ...optimizedQueryConfig('messages', {
      refetchInterval: 30000, // Reduced from 10s to 30s
      staleTime: 15000, // Keep messages fresh for 15 seconds
      gcTime: 120000, // 2 minutes cache
    })
  });
};
