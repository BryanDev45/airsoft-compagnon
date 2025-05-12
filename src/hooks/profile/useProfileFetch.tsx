
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Profile, UserStats } from '@/types/profile';

/**
 * Hook for fetching profile and user statistics data
 */
export const useProfileFetch = (
  userId: string | undefined,
  setProfileData: React.Dispatch<React.SetStateAction<Profile | null>>,
  setUserStats: React.Dispatch<React.SetStateAction<UserStats | null>>
) => {
  const [loading, setLoading] = useState(true);

  const fetchProfileData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
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
        if (userData?.user) {
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
            is_team_leader: null,
            is_verified: null,
            newsletter_subscribed: null
          };
          
          // Insert the new profile
          const { error: insertError } = await supabase
            .from('profiles')
            .insert(newProfile);
            
          if (insertError) throw insertError;
          
          setProfileData(newProfile);
        }
      } else {
        // Create a complete profile object including the newsletter_subscribed property
        const completeProfile: Profile = {
          ...(profile as any),
          newsletter_subscribed: profile.newsletter_subscribed ?? null
        };
        
        setProfileData(completeProfile);
      }

      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (statsError && statsError.code !== 'PGRST116') {
        throw statsError;
      }

      if (!stats) {
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
        
        setUserStats(defaultStats);
      } else {
        setUserStats(stats as UserStats);
      }
      
      setLoading(false);
      return true;
    } catch (error: any) {
      console.error("Error loading data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du profil",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }
  }, [userId, setProfileData, setUserStats]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  return {
    loading,
    fetchProfileData
  };
};
