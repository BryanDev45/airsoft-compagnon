
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  link: string | null;
}

export const useNotificationActions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      
      // Invalider toutes les queries liées aux notifications
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
      
      // Forcer un refetch immédiat du compteur
      if (user?.id) {
        queryClient.refetchQueries({ queryKey: ['unreadNotifications', user.id] });
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNavigateToNotification = async (notification: Notification) => {
    if (notification.link) {
      await handleMarkAsRead(notification.id);
      navigate(notification.link);
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
      
      // Invalider toutes les queries liées aux notifications
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
      
      // Forcer un refetch immédiat du compteur
      queryClient.refetchQueries({ queryKey: ['unreadNotifications', user.id] });
      
      // Supprimer le cache local pour forcer le rechargement
      const cacheKey = `notifications_count_${user.id}`;
      localStorage.removeItem(cacheKey);
      
      console.log("All notifications marked as read, queries invalidated");
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
      
      // Invalider toutes les queries liées aux notifications
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
      
      // Forcer un refetch immédiat du compteur
      if (user?.id) {
        queryClient.refetchQueries({ queryKey: ['unreadNotifications', user.id] });
      }
      
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
      
      // Supprimer seulement les notifications lues qui ne sont pas des demandes en attente
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id)
        .eq('read', true)
        .not('type', 'in', '(friend_request,team_invitation,team_request)');

      if (error) throw error;
      
      // Invalider toutes les queries liées aux notifications
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
      
      // Forcer un refetch immédiat du compteur
      queryClient.refetchQueries({ queryKey: ['unreadNotifications', user.id] });
      
      toast({
        title: "Notifications supprimées",
        description: "Les notifications lues ont été supprimées (sauf les demandes en attente)"
      });
    } catch (error) {
      console.error('Error deleting read notifications:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les notifications lues",
        variant: "destructive"
      });
    }
  };

  return {
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDeleteNotification,
    handleDeleteAllRead,
    handleNavigateToNotification
  };
};
