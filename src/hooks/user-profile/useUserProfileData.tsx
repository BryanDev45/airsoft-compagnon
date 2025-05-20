
import { useUserProfileFetch } from './useUserProfileFetch';
import { useUserEquipment } from './useUserEquipment';
import { useUserBadges } from './useUserBadges';
import { useUserGamesFetch } from './useUserGamesFetch';
import { useUserProfileUtils } from './useUserProfileUtils';

/**
 * Main hook for user profile data that composes all other hooks
 */
export const useUserProfileData = (username: string | undefined) => {
  // Use individual hooks
  const {
    loading: profileLoading,
    userData,
    profileData,
    userStats,
    currentUserId,
    isCurrentUserAdmin
  } = useUserProfileFetch(username);
  
  const { equipment } = useUserEquipment(userData?.id);
  const { userBadges } = useUserBadges(userData?.id);
  const { userGames } = useUserGamesFetch(userData?.id);
  const { updateLocation, updateUserStats, fetchProfileData } = useUserProfileUtils();
  
  // Determine if everything is loaded
  const loading = profileLoading;

  return {
    loading,
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
