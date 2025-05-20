
import { useState } from 'react';
import { clearCacheItem, clearCacheByPrefix, CACHE_DURATIONS } from '@/utils/cacheUtils';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook for managing application-wide cache
 */
export const useAppCache = () => {
  const [clearing, setClearing] = useState(false);

  /**
   * Clear all application cache
   */
  const clearAllCache = () => {
    try {
      setClearing(true);
      localStorage.clear();
      
      toast({
        title: "Cache effacé",
        description: "Toutes les données en cache ont été effacées",
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
      
      toast({
        title: "Erreur",
        description: "Impossible d'effacer le cache",
        variant: "destructive",
      });
    } finally {
      setClearing(false);
    }
  };

  /**
   * Clear specific cache category
   */
  const clearCacheCategory = (category: string) => {
    try {
      setClearing(true);
      clearCacheByPrefix(category);
      
      toast({
        title: "Cache effacé",
        description: `Les données en cache de ${category} ont été effacées`,
      });
    } catch (error) {
      console.error(`Error clearing ${category} cache:`, error);
      
      toast({
        title: "Erreur",
        description: `Impossible d'effacer le cache de ${category}`,
        variant: "destructive",
      });
    } finally {
      setClearing(false);
    }
  };

  return {
    clearing,
    clearAllCache,
    clearCacheCategory,
    CACHE_DURATIONS
  };
};
