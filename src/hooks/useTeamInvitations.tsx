
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

export const useTeamInvitations = () => {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInvitations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('team_invitations')
        .select(`
          *,
          teams (name, logo),
          profiles!team_invitations_inviter_user_id_fkey (username)
        `)
        .eq('invited_user_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Error fetching team invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const respondToInvitation = async (invitationId: string, response: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('team_invitations')
        .update({ status: response })
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: response === 'accepted' ? "Invitation acceptée" : "Invitation refusée",
        description: response === 'accepted' 
          ? "Vous avez rejoint l'équipe avec succès" 
          : "Vous avez refusé l'invitation"
      });

      // Rafraîchir la liste des invitations
      fetchInvitations();
    } catch (error) {
      console.error('Error responding to invitation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de répondre à l'invitation",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [user]);

  return {
    invitations,
    loading,
    fetchInvitations,
    respondToInvitation
  };
};
