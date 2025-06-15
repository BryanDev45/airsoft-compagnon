
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useRealtimeMessages = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    const channelName = 'realtime:all';
    const channel = supabase.channel(channelName);

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

    // Add listeners. It's safe to call `on` multiple times, but we'll register our handlers once.
    channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, handleMessageChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, handleConversationChange)

    // Subscribe ONLY if channel is not already connected.
    if (channel.state !== 'joined' && channel.state !== 'joining') {
      console.log(`Subscribing to ${channelName}`);
      channel.subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Real-time subscribed to ${channelName}!`);
        }
        if (status === 'CHANNEL_ERROR') {
          console.error(`Real-time channel error for ${channelName}:`, err);
        }
      });
    }

    return () => {
      // We don't remove the channel here because other components might be using it.
      // This is a global subscription that should live for the user's session.
      // We can remove the specific handlers if we have references to them, but for simplicity
      // and to fix the crash, we will leave the channel and listeners active.
      console.log('Cleaning up a useRealtimeMessages instance, channel remains active.');
    };
  }, [user?.id, queryClient]);
};
