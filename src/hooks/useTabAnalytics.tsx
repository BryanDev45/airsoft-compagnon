
import { useEffect } from 'react';
import { incrementPageVisit } from '@/utils/analyticsUtils';

/**
 * Hook pour tracker les visites des onglets de recherche
 */
export const useTabAnalytics = (activeTab: string, basePage: string) => {
  useEffect(() => {
    if (activeTab && basePage) {
      // Créer un chemin spécifique pour chaque onglet
      const tabPath = `${basePage}/tab/${activeTab}`;
      
      console.log(`Tracking tab visit: ${tabPath}`);
      
      // Incrémenter le compteur de visite pour cet onglet spécifique
      incrementPageVisit(tabPath);
    }
  }, [activeTab, basePage]);
};
