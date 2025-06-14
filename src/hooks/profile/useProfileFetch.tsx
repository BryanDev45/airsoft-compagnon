
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

        // Always fetch fresh data from database
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*, spoken_language')
          .eq('id', userId)
          .maybeSingle();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw profileError;
        }

        if (!profile) {
          // If no profile exists, create a basic one
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user && isMounted) {
            const metaData = userData.user.user_metadata;
            const newProfile: Profile = {
              id: userId,
              username: metaData.username || `user_${userId.substring(0, 8)}`,
              email: userData.user.email,
              firstname: metaData.firstname || null,
              lastname: metaData.lastname || null,
              birth_date: metaData.birth_date || null,
              age: metaData.age || null,
              join_date: new Date().toISOString().split('T')[0],
              avatar: metaData.avatar || null,
              banner: null,
              bio: null,
              location: null,
              phone_number: null,
              team: null,
              team_id: null,
              team_logo: null,
              is_team_leader: null,
              is_verified: null,
              newsletter_subscribed: null,
              Admin: null,
              Ban: null,
              ban_date: null,
              ban_reason: null,
              banned_by: null,
              reputation: null,
              friends_list_public: null,
              spoken_language: null
            };
            
            // Try to insert the new profile
            const { error: insertError } = await supabase
              .from('profiles')
              .insert(newProfile);
              
            if (!insertError && isMounted) {
              setProfileData(newProfile);
              setStorageWithExpiry(profileCacheKey, newProfile, CACHE_DURATIONS.MEDIUM);
            }
          }
        } else if (isMounted) {
          // Create a complete profile object including all properties
          const completeProfile: Profile = {
            id: profile.id,
            username: profile.username,
            email: profile.email,
            firstname: profile.firstname,
            lastname: profile.lastname,
            birth_date: profile.birth_date,
            age: profile.age,
            join_date: profile.join_date,
            avatar: profile.avatar,
            banner: profile.banner,
            bio: profile.bio,
            location: profile.location,
            phone_number: profile.phone_number,
            team: profile.team,
            team_id: profile.team_id,
            team_logo: null, // This will be fetched from teams table if needed
            is_team_leader: profile.is_team_leader,
            is_verified: profile.is_verified,
            newsletter_subscribed: profile.newsletter_subscribed,
            Admin: profile.Admin,
            Ban: profile.Ban,
            ban_date: profile.ban_date,
            ban_reason: profile.ban_reason,
            banned_by: profile.banned_by,
            reputation: profile.reputation,
            friends_list_public: profile.friends_list_public,
            spoken_language: profile.spoken_language
          };
          
          // If user has a team, fetch team logo
          if (profile.team_id) {
            const { data: teamData } = await supabase
              .from('teams')
              .select('logo')
              .eq('id', profile.team_id)
              .maybeSingle();
            
            if (teamData?.logo) {
              completeProfile.team_logo = teamData.logo;
            }
          }
          
          setProfileData(completeProfile);
          setStorageWithExpiry(profileCacheKey, completeProfile, CACHE_DURATIONS.MEDIUM);
        }

        // Fetch user stats
        const { data: stats, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (statsError) {
          console.error('Stats fetch error:', statsError);
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
            
          if (!insertStatsError && isMounted) {
            setUserStats(defaultStats);
            setStorageWithExpiry(statsCacheKey, defaultStats, CACHE_DURATIONS.MEDIUM);
          }
        } else if (isMounted && stats) {
          setUserStats(stats as UserStats);
          setStorageWithExpiry(statsCacheKey, stats, CACHE_DURATIONS.MEDIUM);
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
