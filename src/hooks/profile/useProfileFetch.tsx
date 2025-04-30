
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook for fetching profile and user statistics data
 */
export const useProfileFetch = (userId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!userId) {
        if (isMounted) setLoading(false);
        return;
      }
      
      try {
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
            const newProfile = {
              id: userId,
              username: metaData.username || `user_${userId.substring(0, 8)}`,
              email: userData.user.email,
              firstname: metaData.firstname,
              lastname: metaData.lastname,
              birth_date: metaData.birth_date,
              age: metaData.age || null,
              join_date: new Date().toISOString().split('T')[0],
              avatar: metaData.avatar
            };
            
            // Insert the new profile
            const { error: insertError } = await supabase
              .from('profiles')
              .insert(newProfile);
              
            if (insertError) throw insertError;
            
            setProfileData(newProfile);
          }
        } else if (isMounted) {
          setProfileData(profile);
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
            const defaultStats = {
              user_id: userId,
              games_played: 0,
              games_organized: 0,
              reputation: 0,
              preferred_game_type: 'CQB',
              favorite_role: 'Assaut',
              level: 'Débutant'
            };
            
            const { error: insertStatsError } = await supabase
              .from('user_stats')
              .insert(defaultStats);
              
            if (insertStatsError) throw insertStatsError;
            
            setUserStats(defaultStats);
          } else if (isMounted) {
            setUserStats(stats);
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
