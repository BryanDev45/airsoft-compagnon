
import { useEffect, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useOptimizedQueries } from './useOptimizedQueries';

export const useUserPresence = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { optimizedQueryConfig } = useOptimizedQueries();
  const lastUpdateRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update user presence status with throttling
  const updatePresence = useCallback(async (isOnline: boolean) => {
    if (!user?.id) return;

    // Throttle updates to prevent excessive requests
    const now = Date.now();
    if (now - lastUpdateRef.current < 30000) { // Increased to 30 seconds throttle
      return;
    }
    lastUpdateRef.current = now;

    try {
      const { error } = await supabase.rpc('update_user_presence', {
        p_user_id: user.id,
        p_is_online: isOnline
      });

      if (error) {
        console.error('Error updating presence:', error);
      }
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  }, [user?.id]);

  // Set user as online when the hook is initialized
  useEffect(() => {
    if (user?.id) {
      updatePresence(true);
    }
  }, [user?.id, updatePresence]);

  // Handle page visibility changes and cleanup
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updatePresence(false);
      } else {
        updatePresence(true);
      }
    };

    const handleBeforeUnload = () => {
      updatePresence(false);
    };

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Update presence every 4 minutes to stay within the 5-minute online threshold
    intervalRef.current = setInterval(() => {
      if (!document.hidden && user?.id) {
        updatePresence(true);
      }
    }, 4 * 60 * 1000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      updatePresence(false);
    };
  }, [updatePresence, user?.id]);

  // Listen to real-time presence updates with reduced frequency
  useEffect(() => {
    const channel = supabase
      .channel('user-presence-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence'
        },
        () => {
          // Invalidate presence queries when any presence data changes
          queryClient.invalidateQueries({ queryKey: ['user-presence'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    updatePresence
  };
};

// Hook to check if a specific user is online with optimized polling
export const useIsUserOnline = (userId: string | undefined) => {
  const { optimizedQueryConfig } = useOptimizedQueries();

  return useQuery({
    queryKey: ['user-presence', userId],
    queryFn: async () => {
      if (!userId) return false;

      const { data, error } = await supabase.rpc('is_user_online', {
        p_user_id: userId
      });

      if (error) {
        console.error('Error checking user online status:', error);
        return false;
      }

      return data || false;
    },
    enabled: !!userId,
    ...optimizedQueryConfig('user-presence', {
      refetchInterval: 120000, // Reduced from 60s to 2 minutes
      staleTime: 90000, // Consider data stale after 90 seconds
      gcTime: 300000, // 5 minutes cache
    })
  });
};
