
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Singleton to prevent multiple subscriptions
class RealtimeManager {
  private static instance: RealtimeManager;
  private channels: any[] = [];
  private currentUserId: string | null = null;
  private subscribers = 0;

  static getInstance(): RealtimeManager {
    if (!RealtimeManager.instance) {
      RealtimeManager.instance = new RealtimeManager();
    }
    return RealtimeManager.instance;
  }

  subscribe(userId: string, queryClient: any) {
    this.subscribers++;
    
    // If already subscribed for this user, don't create new channels
    if (this.currentUserId === userId && this.channels.length > 0) {
      console.log('Real-time already active for user:', userId);
      return () => this.unsubscribe();
    }

    // Clean up existing channels if switching users
    this.cleanup();
    this.currentUserId = userId;

    console.log('Setting up real-time messages subscription for user:', userId);

    // Create unique channel names
    const messageChannelName = `messages-${userId}-${Date.now()}`;
    const conversationChannelName = `conversations-${userId}-${Date.now()}`;

    // Subscribe to message changes
    const messageChannel = supabase
      .channel(messageChannelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('Real-time message update:', payload);
          
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
            queryKey: ['conversations', userId] 
          });
        }
      )
      .subscribe();

    // Subscribe to conversation changes
    const conversationChannel = supabase
      .channel(conversationChannelName)
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
            queryKey: ['conversations', userId] 
          });
        }
      )
      .subscribe();

    this.channels = [messageChannel, conversationChannel];

    return () => this.unsubscribe();
  }

  unsubscribe() {
    this.subscribers--;
    
    // Only cleanup when no more subscribers
    if (this.subscribers <= 0) {
      this.cleanup();
    }
  }

  private cleanup() {
    console.log('Cleaning up real-time subscriptions');
    this.channels.forEach(channel => {
      supabase.removeChannel(channel);
    });
    this.channels = [];
    this.currentUserId = null;
    this.subscribers = 0;
  }
}

export const useRealtimeMessages = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    const manager = RealtimeManager.getInstance();
    const cleanup = manager.subscribe(user.id, queryClient);

    return cleanup;
  }, [user?.id, queryClient]);
};
