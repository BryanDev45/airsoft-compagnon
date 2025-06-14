
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
      
      // Mise à jour immédiate du cache avec une stratégie optimiste
      if (user?.id) {
        const currentCount = queryClient.getQueryData(['unreadNotifications', user.id]) as number || 0;
        const newCount = Math.max(0, currentCount - 1);
        queryClient.setQueryData(['unreadNotifications', user.id], newCount);
      }
      
      // Invalider et refetch pour la cohérence
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
      
      // Forcer un refetch immédiat du compteur pour vérification
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
      
      // Mise à jour optimiste immédiate du compteur à 0
      queryClient.setQueryData(['unreadNotifications', user.id], 0);
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;
      
      // Supprimer le cache local immédiatement
      const cacheKey = `notifications_count_${user.id}`;
      localStorage.removeItem(cacheKey);
      
      // Invalider toutes les queries liées aux notifications
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
      await queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
      
      // Forcer un refetch en arrière-plan pour vérifier la cohérence
      queryClient.refetchQueries({ queryKey: ['unreadNotifications', user.id] });
      
      console.log("All notifications marked as read, immediate cache update applied");
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // En cas d'erreur, restaurer le cache en refetchant
      if (user?.id) {
        queryClient.refetchQueries({ queryKey: ['unreadNotifications', user.id] });
      }
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
      
      // Mise à jour optimiste du compteur
      if (user?.id) {
        const currentCount = queryClient.getQueryData(['unreadNotifications', user.id]) as number || 0;
        const newCount = Math.max(0, currentCount - 1);
        queryClient.setQueryData(['unreadNotifications', user.id], newCount);
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
