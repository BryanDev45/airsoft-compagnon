import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ModerationStats {
  totalUserReports: number;
  pendingUserReports: number;
  resolvedUserReports: number;
  totalMessageReports: number;
  pendingMessageReports: number;
  resolvedMessageReports: number;
  totalWarnings: number;
  activeWarnings: number;
}

export const useModerationStats = () => {
  return useQuery({
    queryKey: ['admin-moderation-stats'],
    queryFn: async (): Promise<ModerationStats> => {
      console.log('Fetching moderation admin statistics...');

      // Check if user_warnings table exists, if not, provide default values
      const moderationQueries = await Promise.allSettled([
        supabase.from('user_reports').select('*', { count: 'exact', head: true }),
        supabase.from('user_reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('user_reports').select('*', { count: 'exact', head: true }).eq('status', 'resolved'),
        supabase.from('message_reports').select('*', { count: 'exact', head: true }),
        supabase.from('message_reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('message_reports').select('*', { count: 'exact', head: true }).eq('status', 'resolved'),
      ]);

      const getCount = (result: PromiseSettledResult<any>, defaultValue = 0) => {
        return result.status === 'fulfilled' ? (result.value?.count || defaultValue) : defaultValue;
      };

      return {
        totalUserReports: getCount(moderationQueries[0]),
        pendingUserReports: getCount(moderationQueries[1]),
        resolvedUserReports: getCount(moderationQueries[2]),
        totalMessageReports: getCount(moderationQueries[3]),
        pendingMessageReports: getCount(moderationQueries[4]),
        resolvedMessageReports: getCount(moderationQueries[5]),
        totalWarnings: 0, // Will be implemented when user_warnings table is available
        activeWarnings: 0, // Will be implemented when user_warnings table is available
      };
    },
    staleTime: 30000,
    refetchInterval: 30000,
  });
};