
import { useState } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Notification {
  id: string;
  related_id: string | null;
}

export const useTeamInvitationActions = (handleMarkAsRead: (id: string) => Promise<void>) => {
  const queryClient = useQueryClient();
  const [processingInvitation, setProcessingInvitation] = useState(false);

  const handleAcceptTeamInvitation = async (notification: Notification) => {
    if (!notification.related_id) return;

    try {
      setProcessingInvitation(true);
      
      const { error } = await supabase
        .from('team_invitations')
        .update({ status: 'accepted' })
        .eq('id', notification.related_id);

      if (error) throw error;

      await handleMarkAsRead(notification.id);

      toast({
        title: "Invitation acceptée",
        description: "Vous avez rejoint l'équipe avec succès"
      });

      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (error) {
      console.error('Error accepting team invitation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter l'invitation",
        variant: "destructive"
      });
    } finally {
      setProcessingInvitation(false);
    }
  };

  const handleRejectTeamInvitation = async (notification: Notification) => {
    if (!notification.related_id) return;

    try {
      setProcessingInvitation(true);
      
      const { error } = await supabase
        .from('team_invitations')
        .update({ status: 'rejected' })
        .eq('id', notification.related_id);

      if (error) throw error;

      await handleMarkAsRead(notification.id);

      toast({
        title: "Invitation refusée",
        description: "Vous avez refusé l'invitation"
      });

      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (error) {
      console.error('Error rejecting team invitation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de refuser l'invitation",
        variant: "destructive"
      });
    } finally {
      setProcessingInvitation(false);
    }
  };

  return {
    processingInvitation,
    handleAcceptTeamInvitation,
    handleRejectTeamInvitation
  };
};
