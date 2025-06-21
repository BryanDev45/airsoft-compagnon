
import { useState, useCallback } from 'react';
import { useOptimizedNotifications } from './useOptimizedNotifications';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export const useNotifications = () => {
  const { user } = useAuth();
  const [markingAsRead, setMarkingAsRead] = useState(false);
  
  const {
    data: notificationSummary,
    isLoading,
    refetch
  } = useOptimizedNotifications();

  const unreadCount = notificationSummary?.unread_count || 0;
  const recentNotifications = notificationSummary?.recent_notifications || [];

  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user?.id) return;

    setMarkingAsRead(true);
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refetch to update counts
      await refetch();
      
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer la notification comme lue",
        variant: "destructive"
      });
    } finally {
      setMarkingAsRead(false);
    }
  }, [user?.id, refetch]);

  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;

    setMarkingAsRead(true);
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      // Refetch to update counts
      await refetch();
      
      toast({
        title: "Succès",
        description: "Toutes les notifications ont été marquées comme lues"
      });
      
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer toutes les notifications comme lues",
        variant: "destructive"
      });
    } finally {
      setMarkingAsRead(false);
    }
  }, [user?.id, refetch]);

  return {
    notifications: recentNotifications,
    unreadCount,
    isLoading,
    markingAsRead,
    markAsRead,
    markAllAsRead,
    refetch
  };
};
