
import { useUserProfileCore } from './useUserProfileCore';
import { useUserStats } from './useUserStats';

/**
 * Hook principal pour récupérer les données de profil utilisateur - VERSION REFACTORISÉE
 */
export const useUserProfileFetch = (username: string | undefined) => {
  const {
    loading: profileLoading,
    profileData,
    currentUserId,
    isCurrentUserAdmin
  } = useUserProfileCore(username);

  const { userStats } = useUserStats(profileData);

  const userData = profileData ? { id: profileData.id, ...profileData } : null;

  console.log('useUserProfileFetch: Final return data:', {
    loading: profileLoading,
    userData,
    profileData,
    userStats,
    currentUserId,
    isCurrentUserAdmin,
  });

  return {
    loading: profileLoading,
    userData,
    profileData,
    userStats,
    currentUserId,
    isCurrentUserAdmin,
  };
};
