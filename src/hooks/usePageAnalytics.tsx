
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
    const trackedPages = [
      '/', 
      '/parties', 
      '/toolbox', 
      '/profile',
      '/team'
    ];
    
    // Vérifier aussi les sous-pages de toolbox
    const isToolboxSubPage = currentPath.startsWith('/toolbox/');
    
    if (trackedPages.includes(currentPath) || isToolboxSubPage) {
      // Délai de 1 seconde pour éviter de compter les redirections rapides
      const timeout = setTimeout(() => {
        // Pour les sous-pages de toolbox, utiliser le chemin complet
        const pathToTrack = isToolboxSubPage ? currentPath : currentPath;
        incrementPageVisit(pathToTrack);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [location.pathname]);
};

/**
 * Hook pour tracker les visites d'onglets spécifiques
 */
export const useTabAnalytics = (tabValue: string, basePage: string) => {
  useEffect(() => {
    if (tabValue) {
      // Délai de 1 seconde pour éviter de compter les changements d'onglets rapides
      const timeout = setTimeout(() => {
        const pathToTrack = `${basePage}/${tabValue}`;
        incrementPageVisit(pathToTrack);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [tabValue, basePage]);
};
