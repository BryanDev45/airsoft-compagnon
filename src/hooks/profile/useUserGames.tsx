
import { useUserGames as useUserGamesManual } from '../user-profile/useUserGames';

/**
 * Hook principal pour les parties utilisateur - utilise la version manuelle qui inclut fetchUserGames
 */
export const useUserGames = (userId: string | undefined) => {
  return useUserGamesManual(userId);
};
