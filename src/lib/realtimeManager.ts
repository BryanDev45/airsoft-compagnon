import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { QueryClient } from '@tanstack/react-query';

class RealtimeManager {
  private channel: RealtimeChannel | null = null;
  private listenerCount = 0;
  private queryClient: QueryClient | null = null;
  private userId: string | null = null;

  public addListener(queryClient: QueryClient, userId: string) {
    if (this.userId && this.userId !== userId) {
      this.cleanup();
    }
    
    this.listenerCount++;
    
    this.queryClient = queryClient;
    this.userId = userId;

    if (!this.channel) {
      this.subscribe();
    }
  }

  public removeListener() {
    this.listenerCount--;
    if (this.listenerCount <= 0) {
      this.cleanup();
    }
  }

  private subscribe() {
    if (!this.userId || !this.queryClient) return;
    
    const channelName = 'realtime:all';
    this.channel = supabase.channel(channelName);

    this.channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => this.handleMessageChange(payload))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, (payload) => this.handleConversationChange(payload))
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Real-time subscribed to ${channelName}!`);
        }
        if (status === 'CHANNEL_ERROR') {
          console.error(`Real-time channel error for ${channelName}:`, err);
          this.cleanup();
        }
      });
  }

  private handleMessageChange = (payload: any) => {
    if (!this.queryClient || !this.userId) return;
    this.queryClient.invalidateQueries({ queryKey: ['conversations'] });
    this.queryClient.invalidateQueries({ queryKey: ['unreadNotifications', this.userId] });

    const record = (payload.new || payload.old) as { conversation_id?: string };
    if (record?.conversation_id) {
      this.queryClient.invalidateQueries({ queryKey: ['messages', record.conversation_id] });
    }
  }
  
  private handleConversationChange = (payload: any) => {
    if (!this.queryClient) return;
    this.queryClient.invalidateQueries({ queryKey: ['conversations'] });
  }

  private cleanup = () => {
    if (this.channel) {
      supabase.removeChannel(this.channel).catch(err => console.error('Error removing channel', err));
      this.channel = null;
    }
    this.listenerCount = 0;
    this.userId = null;
    this.queryClient = null;
  }
}

export const realtimeManager = new RealtimeManager();
