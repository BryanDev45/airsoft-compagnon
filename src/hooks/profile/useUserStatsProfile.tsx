
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserStats } from '@/types/profile';

/**
 * Hook pour les statistiques utilisateur dans le profil
 */
export const useUserStatsProfile = (userId: string | undefined) => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUserStats = async () => {
      try {
        const { data: stats, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (statsError) {
          console.error('Stats fetch error:', statsError);
          throw statsError;
        }

        if (!stats) {
          // Créer des stats par défaut
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
            
          if (!insertStatsError) {
            setUserStats(defaultStats);
          }
        } else {
          setUserStats(stats as UserStats);
        }
      } catch (error) {
        console.error("Error loading user stats:", error);
      }
    };

    fetchUserStats();
  }, [userId]);

  return {
    userStats,
    setUserStats
  };
};
