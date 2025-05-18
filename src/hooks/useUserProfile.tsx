
import { useUserProfileData } from './user-profile/useUserProfileData';
import { useUserSocial } from './user-profile/useUserSocial';

/**
 * Main hook for user profile functionality, combining data fetching and social interactions
 */
export const useUserProfile = (username: string | undefined) => {
  const {
    loading,
    userData,
    profileData,
    userStats,
    equipment,
    userGames,
    userBadges,
    currentUserId,
    updateLocation,
    updateUserStats,
    fetchProfileData
  } = useUserProfileData(username);

  const {
    isFollowing,
    friendRequestSent,
    userRating,
    userReputation,
    handleFollowUser,
    handleRatingChange
  } = useUserSocial(userData, currentUserId);

  return {
    loading,
    userData,
    profileData,
    userStats,
    equipment,
    userGames,
    userBadges,
    isFollowing,
    friendRequestSent,
    userRating,
    userReputation,
    currentUserId,
    handleFollowUser,
    handleRatingChange,
    updateLocation,
    updateUserStats,
    fetchProfileData
  };
};
