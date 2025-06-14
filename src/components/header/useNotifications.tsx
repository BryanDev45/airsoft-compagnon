
import { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getStorageWithExpiry, setStorageWithExpiry, CACHE_DURATIONS } from '@/utils/cacheUtils';
import { useAuth } from '@/hooks/useAuth';

const NOTIFICATIONS_CACHE_KEY = 'notifications_count';

const fetchNotificationCount = async (userId: string): Promise<number> => {
  const cacheKey = `${NOTIFICATIONS_CACHE_KEY}_${userId}`;
  
  // Vérifier le cache d'abord (cache réduit pour une meilleure réactivité)
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
  
  // Cache réduit (15 secondes) pour une meilleure réactivité
  setStorageWithExpiry(cacheKey, countValue, 15000);
  
  return countValue;
};

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Requête optimisée avec React Query - cache réduit pour plus de réactivité
  const { data: notificationCount = 0 } = useQuery({
    queryKey: ['unreadNotifications', user?.id],
    queryFn: () => fetchNotificationCount(user!.id),
    enabled: !!user?.id,
    staleTime: 15000, // 15 secondes au lieu de 30
    gcTime: 1 * 60 * 1000, // 1 minute au lieu de 2
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes au lieu de 60
    refetchOnWindowFocus: true, // Activer le refetch au focus
  });

  const handleSheetOpenChange = (open: boolean) => {
    if (!user?.id) return;

    if (open) {
      // Rafraîchir les données à l'ouverture du volet
      console.log("Opening notifications sheet, refreshing data");
      queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications', user.id] });
      
      // Supprimer le cache local pour forcer le rechargement
      const cacheKey = `${NOTIFICATIONS_CACHE_KEY}_${user.id}`;
      localStorage.removeItem(cacheKey);
    } else {
      // Rafraîchir le compteur à la fermeture du volet
      console.log("Closing notifications sheet, refreshing count");
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications', user.id] });
      
      // Supprimer le cache local aussi
      const cacheKey = `${NOTIFICATIONS_CACHE_KEY}_${user.id}`;
      localStorage.removeItem(cacheKey);
      
      // Forcer un refetch immédiat
      queryClient.refetchQueries({ queryKey: ['unreadNotifications', user.id] });
    }
  };
  
  return {
    notificationCount,
    handleSheetOpenChange
  };
}
