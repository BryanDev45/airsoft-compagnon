
import { useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useUserPresence = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Update user presence status
  const updatePresence = useCallback(async (isOnline: boolean) => {
    if (!user?.id) return;

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

  // Handle page visibility changes
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

    // Update presence every 2 minutes to maintain online status
    const interval = setInterval(() => {
      if (!document.hidden) {
        updatePresence(true);
      }
    }, 2 * 60 * 1000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(interval);
      updatePresence(false);
    };
  }, [updatePresence]);

  // Listen to real-time presence updates
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

// Hook to check if a specific user is online
export const useIsUserOnline = (userId: string | undefined) => {
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
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
  });
};
