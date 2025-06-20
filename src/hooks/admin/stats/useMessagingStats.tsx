
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useMessagingStats = () => {
  return useQuery({
    queryKey: ['admin-messaging-stats'],
    queryFn: async () => {
      console.log('Fetching messaging statistics...');

      const [
        { count: totalMessages },
        { count: totalConversations },
        { count: onlineUsers }
      ] = await Promise.all([
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('conversations').select('*', { count: 'exact', head: true }),
        supabase.from('user_presence')
          .select('*', { count: 'exact', head: true })
          .eq('is_online', true)
          .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString())
      ]);

      return {
        totalMessages: totalMessages || 0,
        totalConversations: totalConversations || 0,
        onlineUsers: onlineUsers || 0,
      };
    },
    staleTime: 30000,
    refetchInterval: 30000,
  });
};
