
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { RealtimeChannel } from '@supabase/supabase-js';

interface PresenceState {
  typing: boolean;
  username: string;
}

interface ChannelData {
  channel: RealtimeChannel;
  count: number;
  // We'll store a map of component-unique keys to their state setters.
  setters: Map<string, { userId: string; setter: React.Dispatch<React.SetStateAction<string[]>> }>;
}

const channels = new Map<string, ChannelData>();
let componentInstanceId = 0;

export const useTypingStatus = (conversationId: string | null) => {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  // Create a unique ID for each instance of this hook.
  const [instanceId] = useState(() => `instance-${componentInstanceId++}`);

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
          presence: { key: user.id },
        },
      });

      const setters = new Map<string, { userId: string; setter: React.Dispatch<React.SetStateAction<string[]>> }>();

      const onSync = () => {
        const presenceState = channel.presenceState<PresenceState>();
        const allTypingUsers = Object.entries(presenceState)
          .filter(([, value]) => value[0]?.typing)
          .map(([key, value]) => ({ id: key, username: value[0].username }));

        setters.forEach(({ userId, setter }) => {
          const filteredTypers = allTypingUsers
            .filter(typingUser => typingUser.id !== userId)
            .map(typingUser => typingUser.username);
          setter(filteredTypers);
        });
      };

      channel.on('presence', { event: 'sync' }, onSync);

      channelData = { channel, count: 0, setters };
      channels.set(channelName, channelData);

      channel.subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
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
    channelData.setters.set(instanceId, { userId: user.id, setter: setTypingUsers });

    // Initial sync for this component instance
    const initialPresenceState = channelData.channel.presenceState<PresenceState>();
    const initialTypers = Object.entries(initialPresenceState)
      .filter(([key, value]) => key !== user.id && value[0]?.typing)
      .map(([, value]) => value[0].username);
    setTypingUsers(initialTypers);

    return () => {
      const currentChannelData = channels.get(channelName);
      if (currentChannelData) {
        currentChannelData.count--;
        currentChannelData.setters.delete(instanceId);

        if (currentChannelData.count <= 0) {
          supabase.removeChannel(currentChannelData.channel).catch(() => {});
          channels.delete(channelName);
        }
      }
    };
  }, [conversationId, user?.id, user?.username, instanceId]);

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
