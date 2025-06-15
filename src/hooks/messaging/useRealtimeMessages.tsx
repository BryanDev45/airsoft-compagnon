
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { realtimeManager } from '@/lib/realtimeManager';

export const useRealtimeMessages = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    realtimeManager.addListener(queryClient, user.id);

    return () => {
      realtimeManager.removeListener();
    };
  }, [user?.id, queryClient]);
};
