
import { useUserGamesRefactored } from './useUserGamesRefactored';

/**
 * Hook principal pour les parties utilisateur - utilise maintenant la version refactorisée
 */
export const useUserGames = (userId: string | undefined) => {
  return useUserGamesRefactored(userId);
};
