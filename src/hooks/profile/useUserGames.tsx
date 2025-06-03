
import { useUserGamesFetch } from '../user-profile/useUserGamesFetch';

/**
 * Hook principal pour les parties utilisateur - utilise la version optimisée avec React Query
 */
export const useUserGames = (userId: string | undefined) => {
  return useUserGamesFetch(userId);
};
