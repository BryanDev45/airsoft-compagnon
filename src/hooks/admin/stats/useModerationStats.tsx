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

      // Get reports stats
      const reportQueries = await Promise.allSettled([
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

      // Placeholder for warnings - will be implemented once table types are updated
      const totalWarnings = 0;
      const activeWarnings = 0;

      return {
        totalUserReports: getCount(reportQueries[0]),
        pendingUserReports: getCount(reportQueries[1]),
        resolvedUserReports: getCount(reportQueries[2]),
        totalMessageReports: getCount(reportQueries[3]),
        pendingMessageReports: getCount(reportQueries[4]),
        resolvedMessageReports: getCount(reportQueries[5]),
        totalWarnings,
        activeWarnings,
      };
    },
    staleTime: 30000,
    refetchInterval: 30000,
  });
};