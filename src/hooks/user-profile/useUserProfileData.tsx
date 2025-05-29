
import { useUserProfileFetch } from './useUserProfileFetch';
import { useUserEquipment } from './useUserEquipment';
import { useUserBadges } from './useUserBadges';
import { useUserGamesFetch } from './useUserGamesFetch';
import { useUserProfileUtils } from './useUserProfileUtils';
import { getStorageWithExpiry, setStorageWithExpiry, CACHE_DURATIONS } from '@/utils/cacheUtils';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook principal optimisé pour les données de profil utilisateur
 */
export const useUserProfileData = (username: string | undefined) => {
  const queryClient = useQueryClient();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const cacheKey = `userProfile_${username || 'current'}`;
  
  // Charger immédiatement depuis le cache pour un rendu instantané
  const cachedUserProfile = getStorageWithExpiry(cacheKey);
  
  // Utiliser les hooks individuels avec optimisations
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
  
  // Charger les données secondaires seulement si on a l'ID utilisateur
  const { equipment } = useUserEquipment(userData?.id, { enabled: !!userData?.id });
  const { userBadges } = useUserBadges(userData?.id, { enabled: !!userData?.id });
  const { userGames } = useUserGamesFetch(userData?.id, { enabled: !!userData?.id });
  const { updateLocation, updateUserStats, fetchProfileData } = useUserProfileUtils();

  // Pré-remplir les données depuis le cache si disponible
  useEffect(() => {
    if (cachedUserProfile && isInitialLoading && !userData) {
      console.log('Loading user profile from cache');
      setUserData(cachedUserProfile.userData);
      setProfileData(cachedUserProfile.profileData);
      setUserStats(cachedUserProfile.userStats);
    }
  }, [cachedUserProfile, isInitialLoading, userData, setUserData, setProfileData, setUserStats]);

  // Stocker les données complètes en cache quand elles sont mises à jour
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
      
      // Mettre à jour le cache avec une durée plus longue pour les profils
      setStorageWithExpiry(cacheKey, completeProfileData, CACHE_DURATIONS.LONG);
      
      // Mettre à jour aussi le cache React Query
      queryClient.setQueryData(['userProfile', username || 'current'], completeProfileData);
      
      setIsInitialLoading(false);
    }
  }, [profileLoading, userData, profileData, userStats, currentUserId, isCurrentUserAdmin, username, queryClient, cacheKey]);
  
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
