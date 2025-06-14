
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
    staleTime: 10000, // 10 secondes pour une réactivité maximale
    gcTime: 30000, // 30 secondes seulement
    refetchInterval: 20000, // Rafraîchir toutes les 20 secondes
    refetchOnWindowFocus: true,
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
    } else {
      // Lors de la fermeture, forcer une mise à jour immédiate du compteur
      console.log("Closing notifications sheet, forcing immediate count update");
      
      // Supprimer le cache local immédiatement
      const cacheKey = `${NOTIFICATIONS_CACHE_KEY}_${user.id}`;
      localStorage.removeItem(cacheKey);
      
      // Mise à jour optimiste du cache : définir le compteur à 0
      queryClient.setQueryData(['unreadNotifications', user.id], 0);
      
      // Ensuite, invalider et refetch pour confirmer la valeur réelle
      await queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
      await queryClient.invalidateQueries({ queryKey: ['unreadNotifications', user.id] });
      
      // Forcer un refetch immédiat en arrière-plan pour vérifier la cohérence
      queryClient.refetchQueries({ queryKey: ['unreadNotifications', user.id] });
    }
  };
  
  return {
    notificationCount,
    handleSheetOpenChange
  };
}
