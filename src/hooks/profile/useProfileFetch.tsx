
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Profile, UserStats } from '@/types/profile';
import { getStorageWithExpiry, setStorageWithExpiry, CACHE_DURATIONS, generateCacheKey } from '@/utils/cacheUtils';

/**
 * Hook for fetching profile and user statistics data with caching
 */
export const useProfileFetch = (userId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!userId) {
        if (isMounted) setLoading(false);
        return;
      }
      
      const profileCacheKey = generateCacheKey('profile_data', { userId });
      const statsCacheKey = generateCacheKey('user_stats', { userId });
      
      try {
        // Try to get profile data from cache first
        const cachedProfile = getStorageWithExpiry(profileCacheKey);
        const cachedStats = getStorageWithExpiry(statsCacheKey);
        
        // If we have valid cached data, use it
        if (cachedProfile && isMounted) {
          console.log('Using cached profile data');
          setProfileData(cachedProfile);
        }
        
        if (cachedStats && isMounted) {
          console.log('Using cached user stats');
          setUserStats(cachedStats);
        }
        
        // If we have both cached profile and stats, we can stop loading
        if (cachedProfile && cachedStats && isMounted) {
          setLoading(false);
        }

        // Always fetch fresh data from database but don't block UI
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        if (!profile) {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user && isMounted) {
            // Create a new profile based on user metadata
            const metaData = userData.user.user_metadata;
            const newProfile: Profile = {
              id: userId,
              username: metaData.username || `user_${userId.substring(0, 8)}`,
              email: userData.user.email,
              firstname: metaData.firstname,
              lastname: metaData.lastname,
              birth_date: metaData.birth_date,
              age: metaData.age || null,
              join_date: new Date().toISOString().split('T')[0],
              avatar: metaData.avatar,
              banner: null,
              bio: null,
              location: null,
              team: null,
              team_id: null,
              team_logo: null,
              is_team_leader: null,
              is_verified: null,
              newsletter_subscribed: null
            };
            
            // Insert the new profile
            const { error: insertError } = await supabase
              .from('profiles')
              .insert(newProfile);
              
            if (insertError) throw insertError;
            
            if (isMounted) {
              setProfileData(newProfile);
              setStorageWithExpiry(profileCacheKey, newProfile, CACHE_DURATIONS.MEDIUM);
            }
          }
        } else if (isMounted) {
          // Create a complete profile object including the newsletter_subscribed property
          const completeProfile: Profile = {
            ...(profile as any),
            newsletter_subscribed: profile.newsletter_subscribed ?? null
          };
          
          setProfileData(completeProfile);
          setStorageWithExpiry(profileCacheKey, completeProfile, CACHE_DURATIONS.MEDIUM);
        }

        if (isMounted) {
          const { data: stats, error: statsError } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

          if (statsError && statsError.code !== 'PGRST116') {
            throw statsError;
          }

          if (!stats && isMounted) {
            // Create default statistics if they don't exist
            const defaultStats: UserStats = {
              user_id: userId,
              games_played: 0,
              games_organized: 0,
              reputation: 0,
              preferred_game_type: 'CQB',
              favorite_role: 'Assaut',
              level: 'Débutant',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            
            const { error: insertStatsError } = await supabase
              .from('user_stats')
              .insert(defaultStats);
              
            if (insertStatsError) throw insertStatsError;
            
            if (isMounted) {
              setUserStats(defaultStats);
              setStorageWithExpiry(statsCacheKey, defaultStats, CACHE_DURATIONS.MEDIUM);
            }
          } else if (isMounted && stats) {
            setUserStats(stats as UserStats);
            setStorageWithExpiry(statsCacheKey, stats, CACHE_DURATIONS.MEDIUM);
          }
        }
      } catch (error: any) {
        console.error("Error loading data:", error);
        if (isMounted) {
          toast({
            title: "Erreur",
            description: "Impossible de charger les données du profil",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return {
    loading,
    profileData,
    userStats,
    setProfileData,
    setUserStats
  };
};
