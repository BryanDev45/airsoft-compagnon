
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useNotificationActions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      if (!user?.id) return;
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      console.log("Deleting notification:", notificationId);
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('Error deleting notification:', error);
        throw error;
      }
      
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
      
      toast({
        title: "Notification supprimée",
        description: "La notification a été supprimée avec succès"
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la notification",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAllRead = async () => {
    try {
      if (!user?.id) return;
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id)
        .eq('read', true);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Notifications supprimées",
        description: "Les notifications lues ont été supprimées"
      });
    } catch (error) {
      console.error('Error deleting read notifications:', error);
    }
  };

  return {
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDeleteNotification,
    handleDeleteAllRead
  };
};
