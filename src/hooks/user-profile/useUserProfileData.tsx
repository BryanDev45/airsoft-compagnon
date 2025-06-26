
import { useUserProfileFetch } from './useUserProfileFetch';
import { useUserEquipment } from './useUserEquipment';
import { useUserBadges } from './useUserBadges';
import { useUserGamesFetch } from './useUserGamesFetch';
import { useUserProfileUtils } from './useUserProfileUtils';
import { useMemo } from 'react';

/**
 * Hook principal optimisé pour les données de profil utilisateur - VERSION ANTI-LOOP
 */
export const useUserProfileData = (username: string | undefined) => {
  console.log('🚀 useUserProfileData called with username:', username);
  
  const {
    loading,
    userData,
    profileData,
    userStats,
    currentUserId,
    isCurrentUserAdmin,
  } = useUserProfileFetch(username);
  
  console.log('👤 useUserProfileData - userData:', { 
    id: userData?.id, 
    username: userData?.username 
  });
  
  const { equipment } = useUserEquipment(userData?.id);
  const { userBadges } = useUserBadges(userData?.id);
  
  // Stable memoized values to prevent infinite re-renders
  const stableUserId = useMemo(() => userData?.id, [userData?.id]);
  const stableUsername = useMemo(() => username, [username]);
  const stableCurrentUserId = useMemo(() => currentUserId, [currentUserId]);
  
  console.log('🎮 About to call useUserGamesFetch with stable values:', {
    userId: stableUserId,
    username: stableUsername,
    currentUserId: stableCurrentUserId
  });
  
  // Use the optimized hook with stable references
  const { userGames, loading: gamesLoading } = useUserGamesFetch(
    stableUserId, 
    stableUsername, 
    stableCurrentUserId
  );
  
  console.log('📈 useUserProfileData final state:', {
    loading: loading || gamesLoading,
    userGamesCount: userGames.length,
    hasUserData: !!userData,
    hasProfileData: !!profileData
  });
  
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
