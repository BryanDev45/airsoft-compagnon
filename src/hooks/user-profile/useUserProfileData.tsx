
import { useUserProfileFetch } from './useUserProfileFetch';
import { useUserEquipment } from './useUserEquipment';
import { useUserBadges } from './useUserBadges';
import { useUserGamesFetch } from './useUserGamesFetch';
import { useUserProfileUtils } from './useUserProfileUtils';
import { useMemo, useRef } from 'react';

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
  
  // Utiliser une référence pour éviter les re-renders inutiles
  const userIdRef = useRef<string | undefined>();
  const usernameRef = useRef<string | undefined>();
  const currentUserIdRef = useRef<string | null | undefined>();
  
  // Seulement mettre à jour si les valeurs changent réellement
  if (userIdRef.current !== userData?.id) {
    userIdRef.current = userData?.id;
  }
  if (usernameRef.current !== username) {
    usernameRef.current = username;
  }
  if (currentUserIdRef.current !== currentUserId) {
    currentUserIdRef.current = currentUserId;
  }
  
  console.log('🎮 About to call useUserGamesFetch with stable refs:', {
    userId: userIdRef.current,
    username: usernameRef.current,
    currentUserId: currentUserIdRef.current
  });
  
  // Utiliser UNIQUEMENT le hook optimisé avec TanStack Query
  const { userGames, loading: gamesLoading } = useUserGamesFetch(
    userIdRef.current, 
    usernameRef.current, 
    currentUserIdRef.current
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
