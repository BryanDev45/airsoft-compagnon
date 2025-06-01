
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Notification {
  id: string;
  related_id: string | null;
}

export const useFriendRequestActions = (handleMarkAsRead: (id: string) => Promise<void>) => {
  const queryClient = useQueryClient();

  const handleAcceptFriendRequest = async (notification: Notification) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', notification.related_id);

      if (error) throw error;
      
      await handleMarkAsRead(notification.id);
      
      toast({
        title: "Demande acceptée",
        description: "Vous êtes maintenant amis",
      });
      
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter la demande d'ami",
        variant: "destructive"
      });
    }
  };

  const handleRejectFriendRequest = async (notification: Notification) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'rejected' })
        .eq('id', notification.related_id);

      if (error) throw error;
      
      await handleMarkAsRead(notification.id);
      
      toast({
        title: "Demande rejetée",
        description: "La demande d'ami a été rejetée",
      });
      
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rejeter la demande d'ami",
        variant: "destructive"
      });
    }
  };

  return {
    handleAcceptFriendRequest,
    handleRejectFriendRequest
  };
};
