
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { incrementPageVisit } from '@/utils/analyticsUtils';

/**
 * Hook pour tracker automatiquement les visites de pages
 */
export const usePageAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Tracker la visite de la page actuelle
    const currentPath = location.pathname;
    
    // Seulement tracker certaines pages importantes
    const trackedPages = ['/', '/parties', '/toolbox', '/admin'];
    
    if (trackedPages.includes(currentPath)) {
      // Délai de 1 seconde pour éviter de compter les redirections rapides
      const timeout = setTimeout(() => {
        incrementPageVisit(currentPath);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [location.pathname]);
};
