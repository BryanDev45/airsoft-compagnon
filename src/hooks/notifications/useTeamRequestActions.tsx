
import { useState } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Notification {
  id: string;
  related_id: string | null;
}

export const useTeamRequestActions = (handleMarkAsRead: (id: string) => Promise<void>) => {
  const queryClient = useQueryClient();
  const [processingRequest, setProcessingRequest] = useState(false);

  const handleAcceptTeamRequest = async (notification: Notification) => {
    if (!notification.related_id) return;

    try {
      setProcessingRequest(true);
      
      const { error } = await supabase
        .from('team_members')
        .update({ status: 'confirmed' })
        .eq('id', notification.related_id);

      if (error) throw error;

      await handleMarkAsRead(notification.id);

      toast({
        title: "Candidature acceptée",
        description: "Le joueur a été accepté dans l'équipe"
      });

      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (error) {
      console.error('Error accepting team request:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter la candidature",
        variant: "destructive"
      });
    } finally {
      setProcessingRequest(false);
    }
  };

  const handleRejectTeamRequest = async (notification: Notification) => {
    if (!notification.related_id) return;

    try {
      setProcessingRequest(true);
      
      const { error } = await supabase
        .from('team_members')
        .update({ status: 'rejected' })
        .eq('id', notification.related_id);

      if (error) throw error;

      await handleMarkAsRead(notification.id);

      toast({
        title: "Candidature refusée",
        description: "La candidature a été refusée"
      });

      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (error) {
      console.error('Error rejecting team request:', error);
      toast({
        title: "Erreur",
        description: "Impossible de refuser la candidature",
        variant: "destructive"
      });
    } finally {
      setProcessingRequest(false);
    }
  };

  return {
    processingRequest,
    handleAcceptTeamRequest,
    handleRejectTeamRequest
  };
};
