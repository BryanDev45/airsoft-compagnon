
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { QueryClient } from '@tanstack/react-query';

class RealtimeManager {
  private channel: RealtimeChannel;
  private listenerCount = 0;
  private queryClient: QueryClient | null = null;
  private userId: string | null = null;
  private readonly channelName = 'realtime:all';

  constructor() {
    this.channel = supabase.channel(this.channelName);
    this.channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => this.handleMessageChange(payload))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, (payload) => this.handleConversationChange(payload))
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Real-time subscribed to ${this.channelName}!`);
        }
        if (status === 'CHANNEL_ERROR') {
          console.error(`Real-time channel error for ${this.channelName}:`, err);
        }
      });
  }

  public addListener(queryClient: QueryClient, userId: string) {
    this.listenerCount++;
    this.queryClient = queryClient;
    this.userId = userId;
  }

  public removeListener() {
    this.listenerCount--;
    if (this.listenerCount <= 0) {
      this.queryClient = null;
      this.userId = null;
    }
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
}

export const realtimeManager = new RealtimeManager();
