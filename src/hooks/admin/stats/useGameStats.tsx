
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useGameStats = () => {
  return useQuery({
    queryKey: ['admin-game-stats'],
    queryFn: async () => {
      console.log('Fetching game statistics...');

      const today = new Date().toISOString().split('T')[0];
      
      const [
        { count: pastGames },
        { count: upcomingGames }
      ] = await Promise.all([
        supabase.from('airsoft_games').select('*', { count: 'exact', head: true }).lt('date', today),
        supabase.from('airsoft_games').select('*', { count: 'exact', head: true }).gte('date', today)
      ]);

      return {
        pastGames: pastGames || 0,
        upcomingGames: upcomingGames || 0,
      };
    },
    staleTime: 30000,
    refetchInterval: 30000,
  });
};
