
import { useState, useEffect } from 'react';
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
  
  const { loading, fetchProfileData } = useProfileFetch(
    userId,
    setProfileData,
    setUserStats
  );
  
  const {
    updating,
    updateLocation,
    updateUserStats,
    updateNewsletterSubscription
  } = useProfileUpdates(userId, setProfileData, setUserStats);
  
  useEffect(() => {
    if (userId) {
      fetchProfileData();
    }
  }, [userId, fetchProfileData]);
  
  return {
    loading: loading || updating,
    profileData,
    userStats,
    updateLocation,
    updateUserStats,
    updateNewsletterSubscription,
    fetchProfileData
  };
};
