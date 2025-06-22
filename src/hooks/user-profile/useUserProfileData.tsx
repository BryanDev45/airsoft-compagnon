
import { useUserProfileFetch } from './useUserProfileFetch';
import { useUserEquipment } from './useUserEquipment';
import { useUserBadges } from './useUserBadges';
import { useUserGamesFetch } from './useUserGamesFetch';
import { useUserProfileUtils } from './useUserProfileUtils';

/**
 * Hook principal optimisé pour les données de profil utilisateur
 */
export const useUserProfileData = (username: string | undefined) => {
  const {
    loading,
    userData,
    profileData,
    userStats,
    currentUserId,
    isCurrentUserAdmin,
  } = useUserProfileFetch(username);
  
  const { equipment } = useUserEquipment(userData?.id);
  const { userBadges } = useUserBadges(userData?.id);
  
  // Utiliser le hook optimisé avec TanStack Query pour éviter les boucles
  const { userGames, loading: gamesLoading } = useUserGamesFetch(userData?.id, username, currentUserId);
  
  const { updateLocation, updateUserStats, fetchProfileData } = useUserProfileUtils();

  return {
    loading: loading || gamesLoading,
    userData,
    profileData,
    userStats,
    equipment,
    userGames,
    userBadges,
    currentUserId,
    isCurrentUserAdmin,
    updateLocation,
    updateUserStats,
    fetchProfileData
  };
};
