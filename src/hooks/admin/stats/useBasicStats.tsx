
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBasicStats = () => {
  return useQuery({
    queryKey: ['admin-basic-stats'],
    queryFn: async () => {
      console.log('Fetching basic admin statistics...');

      const [
        { count: totalUsers },
        { count: totalTeams },
        { count: totalGames },
        { count: verifiedUsers },
        { count: bannedUsers }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('teams').select('*', { count: 'exact', head: true }),
        supabase.from('airsoft_games').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_verified', true),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('Ban', true)
      ]);

      return {
        totalUsers: totalUsers || 0,
        totalTeams: totalTeams || 0,
        totalGames: totalGames || 0,
        verifiedUsers: verifiedUsers || 0,
        bannedUsers: bannedUsers || 0,
      };
    },
    staleTime: 30000,
    refetchInterval: 30000,
  });
};
