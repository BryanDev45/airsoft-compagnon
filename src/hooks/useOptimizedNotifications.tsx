
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface NotificationSummary {
  unread_count: number;
  total_count: number;
  recent_notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    created_at: string;
    link: string | null;
  }> | null;
}

export const useOptimizedNotifications = () => {
  const { user } = useAuth();

  const queryFn = async (): Promise<NotificationSummary> => {
    if (!user?.id) {
      return { unread_count: 0, total_count: 0, recent_notifications: null };
    }

    const { data, error } = await supabase.rpc('get_user_notification_summary', {
      p_user_id: user.id
    });

    if (error) {
      console.error('Error fetching notification summary:', error);
      throw error;
    }

    const result = data?.[0];
    if (!result) {
      return { unread_count: 0, total_count: 0, recent_notifications: null };
    }

    return {
      unread_count: result.unread_count || 0,
      total_count: result.total_count || 0,
      recent_notifications: result.recent_notifications as any[] || null
    };
  };

  return useQuery<NotificationSummary, Error>({
    queryKey: ['optimized-notifications', user?.id],
    queryFn,
    enabled: !!user?.id,
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
    refetchInterval: 120000, // Refetch every 2 minutes instead of 30 seconds
    refetchOnWindowFocus: false,
  });
};
