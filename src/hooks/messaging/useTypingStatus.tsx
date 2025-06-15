
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { RealtimeChannel } from '@supabase/supabase-js';

interface PresenceState {
  typing: boolean;
  username: string;
}

export const useTypingStatus = (conversationId: string | null) => {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    // If conversationId or user details are missing, clean up any existing channel.
    if (!conversationId || !user?.id || !user.username) {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setTypingUsers([]);
      return;
    }

    // Clean up the old channel when the conversationId changes.
    // This is handled by the effect's cleanup function.

    const channelName = `typing:${conversationId}`;
    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });
    channelRef.current = channel;

    const onSync = () => {
      if(channelRef.current?.state !== 'joined') return;
      const presenceState = channelRef.current.presenceState<PresenceState>();
      const typers = Object.entries(presenceState)
        .filter(([key, value]) => key !== user.id && value[0]?.typing)
        .map(([, value]) => value[0].username);
      setTypingUsers(typers);
    };
    
    channel
      .on('presence', { event: 'sync' }, onSync)
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Presence subscribed to ${channelName}`);
          // Track initial state when subscribed
          channel.track({ typing: false, username: user.username });
        }
        if (status === 'CHANNEL_ERROR') {
          console.error(`Presence channel error for ${channelName}:`, err);
        }
      });


    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [conversationId, user?.id, user?.username]);

  const trackTyping = (isTyping: boolean) => {
    if (channelRef.current && user?.username && channelRef.current.state === 'joined') {
      channelRef.current.track({ typing: isTyping, username: user.username });
    }
  };

  return { typingUsers, trackTyping };
};
