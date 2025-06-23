
import { useState } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Notification {
  id: string;
  related_id: string | null;
}

export const useFriendRequestActions = (handleMarkAsRead: (id: string) => Promise<void>) => {
  const queryClient = useQueryClient();
  const [processingInvitation, setProcessingInvitation] = useState(false);

  const handleAcceptFriendRequest = async (notification: Notification) => {
    if (!notification.related_id) {
      toast({
        title: "Erreur",
        description: "Impossible de traiter cette demande d'ami",
        variant: "destructive"
      });
      return;
    }

    try {
      setProcessingInvitation(true);
      
      // Accepter la demande d'ami en mettant à jour le statut
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', notification.related_id);

      if (error) throw error;
      
      // Marquer la notification comme lue
      await handleMarkAsRead(notification.id);
      
      toast({
        title: "Demande acceptée",
        description: "Vous êtes maintenant amis",
      });
      
      // Invalider les caches pour actualiser les données
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['friendships'] });
      
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter la demande d'ami",
        variant: "destructive"
      });
    } finally {
      setProcessingInvitation(false);
    }
  };

  const handleRejectFriendRequest = async (notification: Notification) => {
    if (!notification.related_id) {
      toast({
        title: "Erreur",
        description: "Impossible de traiter cette demande d'ami",
        variant: "destructive"
      });
      return;
    }

    try {
      setProcessingInvitation(true);
      
      // Rejeter la demande d'ami en mettant à jour le statut
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'rejected' })
        .eq('id', notification.related_id);

      if (error) throw error;
      
      // Marquer la notification comme lue
      await handleMarkAsRead(notification.id);
      
      toast({
        title: "Demande rejetée",
        description: "La demande d'ami a été rejetée",
      });
      
      // Invalider les caches pour actualiser les données
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['friendships'] });
      
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rejeter la demande d'ami",
        variant: "destructive"
      });
    } finally {
      setProcessingInvitation(false);
    }
  };

  return {
    processingInvitation,
    handleAcceptFriendRequest,
    handleRejectFriendRequest
  };
};
