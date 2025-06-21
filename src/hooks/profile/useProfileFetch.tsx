
import { useProfileCore } from './useProfileCore';
import { useUserStatsProfile } from './useUserStatsProfile';

/**
 * Hook principal pour récupérer les données de profil - VERSION REFACTORISÉE
 */
export const useProfileFetch = (userId: string | undefined) => {
  const {
    loading: profileLoading,
    profileData,
    setProfileData
  } = useProfileCore(userId);

  const {
    userStats,
    setUserStats
  } = useUserStatsProfile(userId);

  return {
    loading: profileLoading,
    profileData,
    userStats,
    setProfileData,
    setUserStats
  };
};
