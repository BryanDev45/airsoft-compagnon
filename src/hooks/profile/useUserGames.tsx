
import { useUserGamesFetch } from '../user-profile/useUserGamesFetch';
import { useCallback } from 'react';

/**
 * Hook principal pour les parties utilisateur - VERSION ANTI-LOOP avec TanStack Query optimisée
 */
export const useUserGames = (userId: string | undefined) => {
  const { userGames, loading, refetch } = useUserGamesFetch(userId, undefined, undefined);
  
  // Create stable fetchUserGames function
  const fetchUserGames = useCallback(() => {
    console.log('fetchUserGames called, triggering refetch');
    return refetch();
  }, [refetch]);
  
  return {
    userGames,
    loading,
    fetchUserGames
  };
};
