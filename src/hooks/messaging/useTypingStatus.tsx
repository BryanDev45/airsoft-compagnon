
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
    if (!conversationId || !user?.id || !user.username) {
      setTypingUsers([]);
      return;
    }

    const channel = supabase.channel(`typing:${conversationId}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });
    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState<PresenceState>();
        const typers = Object.entries(presenceState)
          .filter(([key, value]) => key !== user.id && value[0]?.typing)
          .map(([, value]) => value[0].username);
        setTypingUsers(typers);
      })
      .subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
        channelRef.current = null;
      }
    };
  }, [conversationId, user?.id, user?.username]);

  const trackTyping = (isTyping: boolean) => {
    if (channelRef.current && user?.username) {
      channelRef.current.track({ typing: isTyping, username: user.username });
    }
  };

  return { typingUsers, trackTyping };
};
