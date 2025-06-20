import { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getStorageWithExpiry, setStorageWithExpiry } from '@/utils/cacheUtils';
import { useAuth } from '@/hooks/useAuth';
import { useOptimizedQueries } from '@/hooks/messaging/useOptimizedQueries';

const NOTIFICATIONS_CACHE_KEY = 'notifications_count';

const fetchNotificationCount = async (userId: string): Promise<number> => {
  const cacheKey = `${NOTIFICATIONS_CACHE_KEY}_${userId}`;
  
  // Vérifier le cache d'abord
  const cachedCount = getStorageWithExpiry(cacheKey);
  if (cachedCount !== null) {
    return cachedCount;
  }
  
  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false);
    
  if (error) throw error;
  
  const countValue = count || 0;
  
  // Cache for 60 seconds instead of 30
  setStorageWithExpiry(cacheKey, countValue, 60000);
  
  return countValue;
};

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { optimizedQueryConfig } = useOptimizedQueries();
  
  // Requête optimisée avec React Query
  const { data: notificationCount = 0 } = useQuery<number, Error>({
    queryKey: ['unreadNotifications', user?.id],
    queryFn: () => fetchNotificationCount(user!.id),
    enabled: !!user?.id,
    ...optimizedQueryConfig('unreadNotifications', {
      staleTime: 60000, // 60 seconds
      gcTime: 180000, // 3 minutes
      refetchInterval: 120000, // Reduced from 60s to 2 minutes
      refetchOnWindowFocus: true,
    })
  });

  const handleSheetOpenChange = async (open: boolean) => {
    if (!user?.id) return;

    if (open) {
      // Rafraîchir les données à l'ouverture du volet
      console.log("Opening notifications sheet, refreshing data");
      queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications', user.id] });
      
      // Supprimer le cache local pour forcer le rechargement
      const cacheKey = `${NOTIFICATIONS_CACHE_KEY}_${user.id}`;
      localStorage.removeItem(cacheKey);
    }
  };
  
  return {
    notificationCount,
    handleSheetOpenChange
  };
}
