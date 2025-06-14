
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useRealtimeMessages = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up real-time messages subscription');

    // Subscribe to message changes
    const messageChannel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('Real-time message update:', payload);
          
          // Type-safe access to payload data
          const newRecord = payload.new as any;
          const oldRecord = payload.old as any;
          
          // Invalidate messages queries for the affected conversation
          if (newRecord?.conversation_id) {
            queryClient.invalidateQueries({ 
              queryKey: ['messages', newRecord.conversation_id] 
            });
          }
          if (oldRecord?.conversation_id) {
            queryClient.invalidateQueries({ 
              queryKey: ['messages', oldRecord.conversation_id] 
            });
          }
          
          // Invalidate conversations list to update last message/unread count
          queryClient.invalidateQueries({ 
            queryKey: ['conversations', user.id] 
          });
        }
      )
      .subscribe();

    // Subscribe to conversation changes
    const conversationChannel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        (payload) => {
          console.log('Real-time conversation update:', payload);
          
          // Invalidate conversations queries
          queryClient.invalidateQueries({ 
            queryKey: ['conversations', user.id] 
          });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscriptions');
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(conversationChannel);
    };
  }, [user?.id, queryClient]);
};
