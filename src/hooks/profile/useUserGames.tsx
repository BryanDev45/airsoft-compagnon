
import { useUserGamesFetch } from '../user-profile/useUserGamesFetch';

/**
 * Hook principal pour les parties utilisateur - utilise la version TanStack Query optimisée
 */
export const useUserGames = (userId: string | undefined) => {
  const { userGames, loading, refetch } = useUserGamesFetch(userId, undefined, undefined);
  
  return {
    userGames,
    loading,
    fetchUserGames: refetch // Exposer refetch comme fetchUserGames pour la compatibilité
  };
};
