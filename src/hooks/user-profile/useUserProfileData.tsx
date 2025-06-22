
import { useUserProfileFetch } from './useUserProfileFetch';
import { useUserEquipment } from './useUserEquipment';
import { useUserBadges } from './useUserBadges';
import { useUserGamesFetch } from './useUserGamesFetch';
import { useUserProfileUtils } from './useUserProfileUtils';
import { useMemo } from 'react';

/**
 * Hook principal optimisé pour les données de profil utilisateur
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
  
  // Stabiliser les paramètres pour éviter les re-renders
  const stableParams = useMemo(() => ({
    userId: userData?.id,
    username: username,
    currentUserId: currentUserId
  }), [userData?.id, username, currentUserId]);
  
  console.log('🎮 About to call useUserGamesFetch with:', stableParams);
  
  // Utiliser UNIQUEMENT le hook optimisé avec TanStack Query
  const { userGames, loading: gamesLoading } = useUserGamesFetch(
    stableParams.userId, 
    stableParams.username, 
    stableParams.currentUserId
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
