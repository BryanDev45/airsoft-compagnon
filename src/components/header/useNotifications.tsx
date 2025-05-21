
import { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getStorageWithExpiry, setStorageWithExpiry } from '@/utils/cacheUtils';
import { useAuth } from '@/hooks/useAuth';

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Requête pour récupérer le nombre de notifications non lues avec mise en cache
  const { data: notificationCount = 0 } = useQuery({
    queryKey: ['unreadNotifications'],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      // Try to get from cache first
      const cachedCount = getStorageWithExpiry(`notifications_count_${user.id}`);
      if (cachedCount !== null) {
        return cachedCount;
      }
      
      // If not in cache, fetch from API
      const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);
        
      if (error) throw error;
      
      const countValue = count || 0;
      
      // Update cache
      setStorageWithExpiry(`notifications_count_${user.id}`, countValue, 30000); // 30 seconds
      
      return countValue;
    },
    enabled: !!user?.id,
    staleTime: 30000, // 30 secondes avant considérer les données comme obsolètes
    gcTime: 5 * 60 * 1000, // 5 minutes de mise en cache côté React Query
    refetchInterval: 60000, // Rafraîchir toutes les minutes
  });

  // Effet pour rafraîchir le compteur de notifications quand la feuille est fermée
  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
      // Rafraîchir les notifications quand on ferme la feuille
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
    }
  };
  
  return {
    notificationCount,
    handleSheetOpenChange
  };
}
