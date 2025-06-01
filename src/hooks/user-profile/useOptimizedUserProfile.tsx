
import { useBatchedQueries } from '../cache/useBatchedQueries';
import { supabase } from '@/integrations/supabase/client';

export const useOptimizedUserProfile = (username: string | undefined) => {
  const queries = [
    {
      queryKey: ['userProfile', username || 'current'],
      queryFn: async () => {
        if (!username) return null;
        
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();
          
        if (userError) throw userError;
        return userData;
      },
      enabled: !!username,
      cacheTTL: 10 * 60 * 1000 // 10 minutes pour les profils
    },
    {
      queryKey: ['userStats', username || 'current'],
      queryFn: async () => {
        if (!username) return null;
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', username)
          .single();
          
        if (!profileData?.id) return null;
        
        const { data: statsData, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', profileData.id)
          .single();
          
        if (statsError) throw statsError;
        return statsData;
      },
      enabled: !!username,
      cacheTTL: 15 * 60 * 1000 // 15 minutes pour les stats
    }
  ];

  const results = useBatchedQueries(queries);
  
  return {
    userData: results[0]?.data,
    userStats: results[1]?.data,
    loading: results.some(r => r.isLoading),
    error: results.find(r => r.error)?.error
  };
};
