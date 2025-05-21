
import { useUserProfileFetch } from './useUserProfileFetch';
import { useUserEquipment } from './useUserEquipment';
import { useUserBadges } from './useUserBadges';
import { useUserGamesFetch } from './useUserGamesFetch';
import { useUserProfileUtils } from './useUserProfileUtils';
import { getStorageWithExpiry, setStorageWithExpiry, CACHE_DURATIONS } from '@/utils/cacheUtils';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Main hook for user profile data that composes all other hooks
 */
export const useUserProfileData = (username: string | undefined) => {
  const queryClient = useQueryClient();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const cacheKey = `userProfile_${username || 'current'}`;
  
  // Try to load data from cache first for instant rendering
  const cachedUserProfile = getStorageWithExpiry(cacheKey);
  
  // Use individual hooks
  const {
    loading: profileLoading,
    userData,
    profileData,
    userStats,
    currentUserId,
    isCurrentUserAdmin,
    setUserData,
    setProfileData,
    setUserStats
  } = useUserProfileFetch(username);
  
  const { equipment } = useUserEquipment(userData?.id);
  const { userBadges } = useUserBadges(userData?.id);
  const { userGames } = useUserGamesFetch(userData?.id);
  const { updateLocation, updateUserStats, fetchProfileData } = useUserProfileUtils();

  // Store complete profile data in cache whenever it updates
  useEffect(() => {
    if (!profileLoading && userData && profileData) {
      const completeProfileData = {
        userData,
        profileData,
        userStats,
        currentUserId,
        isCurrentUserAdmin,
        lastUpdated: new Date().toISOString()
      };
      
      // Update cache
      setStorageWithExpiry(cacheKey, completeProfileData, CACHE_DURATIONS.MEDIUM);
      
      // Also update React Query cache
      queryClient.setQueryData(['userProfile', username || 'current'], completeProfileData);
      
      // Initial loading is complete
      setIsInitialLoading(false);
    }
  }, [profileLoading, userData, profileData, userStats, currentUserId, isCurrentUserAdmin, username, queryClient, cacheKey]);
  
  // Pre-populate state from cache for instant rendering if available
  useEffect(() => {
    if (cachedUserProfile && isInitialLoading) {
      setUserData(cachedUserProfile.userData);
      setProfileData(cachedUserProfile.profileData);
      setUserStats(cachedUserProfile.userStats);
      
      // Still mark as initially loading until fresh data comes in
      // This allows us to show cached content immediately while waiting for fresh data
    }
  }, [cachedUserProfile, isInitialLoading]);
  
  // Determine if everything is loaded
  const loading = isInitialLoading && profileLoading;

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
