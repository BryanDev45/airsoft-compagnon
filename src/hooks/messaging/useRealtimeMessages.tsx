
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Module-level state removed to prevent subscription errors.
// Each hook instance will manage its own channel.

export const useRealtimeMessages = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!user?.id) {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current).catch(err => console.error('Error removing channel', err));
        channelRef.current = null;
      }
      return;
    }
    
    const channelName = 'realtime:all';
    const channel = supabase.channel(channelName);
    channelRef.current = channel;

    const handleMessageChange = (payload: any) => {
      console.log('Real-time message change:', payload);
      // Invalider les conversations pour mettre à jour le dernier message et le compteur de non-lus
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications', user.id] });

      // Invalider aussi les messages de la conversation spécifique
      const record = (payload.new || payload.old) as { conversation_id?: string };
      if (record?.conversation_id) {
        queryClient.invalidateQueries({ queryKey: ['messages', record.conversation_id] });
      }
    };
    
    const handleConversationChange = (payload: any) => {
      console.log('Real-time conversation change:', payload);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };

    channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, handleMessageChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, handleConversationChange)
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Real-time subscribed to ${channelName}!`);
        }
        if (status === 'CHANNEL_ERROR') {
          console.error(`Real-time channel error for ${channelName}:`, err);
        }
      });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current).catch(err => console.error('Error removing channel', err));
        channelRef.current = null;
      }
    };
  }, [user?.id, queryClient]);
};
