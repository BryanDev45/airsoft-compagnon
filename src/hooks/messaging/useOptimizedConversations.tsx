
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Conversation } from '@/types/messaging';
import { useState, useRef } from 'react';

interface ConversationData {
  conversation_id: string;
  conversation_type: 'direct' | 'team';
  conversation_name: string | null;
  created_at: string;
  updated_at: string;
  team_id: string | null;
  last_message: {
    content: string;
    created_at: string;
    sender_name: string;
  } | null;
  participant_count: number;
  other_participants: Array<{
    id: string;
    username: string;
    avatar: string | null;
  }> | null;
  unread_count: number;
}

export const useOptimizedConversations = () => {
  const { user } = useAuth();
  const [retryCount, setRetryCount] = useState(0);
  const lastErrorTime = useRef<number>(0);

  const queryFn = async (): Promise<Conversation[]> => {
    if (!user?.id) {
      console.log('[OptimizedConversations] No user ID available');
      return [];
    }

    // Circuit breaker: if too many retries in short time, fail fast
    const now = Date.now();
    if (retryCount > 3 && (now - lastErrorTime.current) < 30000) {
      throw new Error('Trop de tentatives de chargement. Veuillez actualiser la page.');
    }

    try {
      console.log('[OptimizedConversations] Fetching conversations for user:', user.id);
      
      const { data, error } = await supabase.rpc('get_user_conversations_with_details', {
        p_user_id: user.id
      });

      if (error) {
        console.error('[OptimizedConversations] Error fetching conversations:', error);
        setRetryCount(prev => prev + 1);
        lastErrorTime.current = now;
        throw error;
      }

      // Reset retry count on success
      setRetryCount(0);

      if (!data || data.length === 0) {
        console.log('[OptimizedConversations] No conversation data returned');
        return [];
      }

      console.log('[OptimizedConversations] Raw conversation data:', data);

      // Transform the data to match our Conversation interface
      const conversations: Conversation[] = data.map((conv: ConversationData) => {
        let lastMessage = undefined;
        if (conv.last_message) {
          lastMessage = {
            content: conv.last_message.content,
            created_at: conv.last_message.created_at,
            sender_name: conv.last_message.sender_name
          };
        }

        // Handle participants - ensure we always have an array
        const participants = Array.isArray(conv.other_participants) 
          ? conv.other_participants.map(p => ({
              id: p.id,
              username: p.username,
              avatar: p.avatar
            })) 
          : [];

        return {
          id: conv.conversation_id,
          type: conv.conversation_type,
          name: conv.conversation_name || undefined,
          participants,
          lastMessage,
          unread_count: conv.unread_count || 0
        };
      });

      console.log('[OptimizedConversations] Transformed conversations:', conversations);
      return conversations;
    } catch (error) {
      console.error('[OptimizedConversations] Error in query:', error);
      setRetryCount(prev => prev + 1);
      lastErrorTime.current = now;
      throw error;
    }
  };

  return useQuery<Conversation[], Error>({
    queryKey: ['optimized-conversations', user?.id],
    queryFn,
    enabled: !!user?.id,
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
    refetchInterval: false, // Disable auto-refetch to prevent loops
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry on permission errors or if user is not authenticated
      if (error?.message?.includes('permission') || 
          error?.message?.includes('Trop de tentatives') || 
          !user?.id) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
  });
};
