
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Profile, UserStats } from '@/types/profile';
import { useProfileFetch } from './useProfileFetch';
import { useProfileUpdates } from './useProfileUpdates';

/**
 * Hook for profile data management with updates
 */
export const useProfileData = (userId: string | null) => {
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  
  const { loading: fetchLoading, fetchProfileData } = useProfileFetch(userId, setProfileData, setUserStats);
  
  const {
    updating,
    updateLocation,
    updateUserStats,
    updateNewsletterSubscription
  } = useProfileUpdates(userId, setProfileData, setUserStats);
  
  // Wrap fetchProfileData in useCallback to avoid infinite loops
  const refetchProfileData = useCallback(() => {
    if (userId && fetchProfileData) {
      fetchProfileData();
    }
  }, [userId, fetchProfileData]);
  
  useEffect(() => {
    if (userId) {
      refetchProfileData();
    }
  }, [userId, refetchProfileData]);
  
  return {
    loading: fetchLoading || updating,
    profileData,
    userStats,
    updateLocation,
    updateUserStats,
    updateNewsletterSubscription,
    fetchProfileData: refetchProfileData
  };
};
