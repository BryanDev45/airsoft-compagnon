
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { RealtimeChannel } from '@supabase/supabase-js';

interface PresenceState {
  typing: boolean;
  username: string;
}

const channels = new Map<string, { channel: RealtimeChannel; count: number }>();

export const useTypingStatus = (conversationId: string | null) => {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const onSync = useCallback(() => {
    if (!conversationId || !user?.id) return;

    const channelName = `typing:${conversationId}`;
    const channelData = channels.get(channelName);
    
    if (!channelData || channelData.channel.state !== 'joined') return;
    
    const presenceState = channelData.channel.presenceState<PresenceState>();
    const typers = Object.entries(presenceState)
      .filter(([key, value]) => key !== user.id && value[0]?.typing)
      .map(([, value]) => value[0].username);
    setTypingUsers(typers);
  }, [conversationId, user?.id]);

  useEffect(() => {
    if (!conversationId || !user?.id || !user.username) {
      setTypingUsers([]);
      return;
    }

    const channelName = `typing:${conversationId}`;
    let channelData = channels.get(channelName);

    if (!channelData) {
      const channel = supabase.channel(channelName, {
        config: {
          presence: {
            key: user.id,
          },
        },
      });

      channelData = { channel, count: 0 };
      channels.set(channelName, channelData);

      channel.subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Presence subscribed to ${channelName}`);
          channel.track({ typing: false, username: user.username });
        }
        if (status === 'CHANNEL_ERROR') {
          console.error(`Presence channel error for ${channelName}:`, err);
          supabase.removeChannel(channel).catch(() => {});
          channels.delete(channelName);
        }
      });
    }

    channelData.count++;
    channelData.channel.on('presence', { event: 'sync' }, onSync);
    onSync(); // Initial sync

    return () => {
      const currentChannelData = channels.get(channelName);
      if (currentChannelData) {
        currentChannelData.count--;
        currentChannelData.channel.off('presence', { event: 'sync' }, onSync);

        if (currentChannelData.count <= 0) {
          supabase.removeChannel(currentChannelData.channel).catch(() => {});
          channels.delete(channelName);
        }
      }
    };
  }, [conversationId, user?.id, user?.username, onSync]);

  const trackTyping = (isTyping: boolean) => {
    if (conversationId && user?.username) {
      const channelName = `typing:${conversationId}`;
      const channelData = channels.get(channelName);
      if (channelData && channelData.channel.state === 'joined') {
        channelData.channel.track({ typing: isTyping, username: user.username });
      }
    }
  };

  return { typingUsers, trackTyping };
};
