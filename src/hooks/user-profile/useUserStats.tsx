
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { triggerUserStatsUpdate } from '@/utils/supabaseHelpers';

/**
 * Hook pour gérer les statistiques utilisateur
 */
export const useUserStats = (profileData: any) => {
  const [userStats, setUserStats] = useState<any>(null);
  const statsUpdateTriggered = useRef(false);
  const statsLoaded = useRef(false);

  useEffect(() => {
    if (!profileData?.id || statsLoaded.current) return;

    const fetchUserStats = async () => {
      try {
        const { data: stats, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', profileData.id)
          .maybeSingle();

        if (statsError && statsError.code !== 'PGRST116') {
          console.error('Stats fetch error:', statsError);
          throw statsError;
        }

        const defaultStats = {
          user_id: profileData.id,
          games_played: 0,
          games_organized: 0,
          preferred_game_type: 'Indéfini',
          favorite_role: 'Indéfini',
          level: 'Débutant',
          reputation: profileData.reputation || 0,
          win_rate: '0%',
          accuracy: '0%',
          time_played: '0h',
          objectives_completed: 0,
          flags_captured: 0,
          tactical_awareness: 'À évaluer'
        };

        setUserStats(stats || defaultStats);
        statsLoaded.current = true;

        // Déclencher la mise à jour des stats UNE SEULE FOIS
        if (!statsUpdateTriggered.current) {
          console.log(`Déclenchement UNIQUE de la mise à jour des statistiques pour: ${profileData.id}`);
          statsUpdateTriggered.current = true;
          
          triggerUserStatsUpdate(profileData.id)
            .catch(error => {
              console.error('Erreur lors de la mise à jour des stats:', error);
            });
        }

      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchUserStats();
  }, [profileData?.id]);

  return { userStats };
};
