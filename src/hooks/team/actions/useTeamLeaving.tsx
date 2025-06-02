
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { TeamData } from '@/types/team';

export const useTeamLeaving = (
  team: TeamData,
  user: any,
  isTeamLeader: boolean,
  onClose: () => void
) => {
  const [loading, setLoading] = useState(false);

  const handleLeaveTeam = async () => {
    if (!user?.id || !team?.id) return;
    
    if (isTeamLeader) {
      toast({
        title: "Action impossible",
        description: "En tant que leader de l'équipe, vous devez transférer la propriété avant de quitter ou supprimer l'équipe.",
        variant: "destructive",
      });
      return;
    }
    
    if (!confirm("Êtes-vous sûr de vouloir quitter cette équipe ?")) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Get current user data to refresh auth state
      const { data: userData } = await supabase.auth.getUser();
      
      // Delete the team member record
      const { error: teamMemberError } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', team.id)
        .eq('user_id', user.id);
        
      if (teamMemberError) {
        console.error("Error leaving team:", teamMemberError);
        throw teamMemberError;
      }

      // Update the user profile to remove team information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          team: null,
          team_id: null,
          is_team_leader: false
        })
        .eq('id', user.id);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        throw profileError;
      }
      
      toast({
        title: "Équipe quittée",
        description: "Vous avez quitté l'équipe avec succès.",
      });
      
      // Close dialogs and redirect
      onClose();
      
      // Force a page reload to refresh all team-related state
      window.location.href = '/';
      
    } catch (error: any) {
      console.error("Erreur lors du départ de l'équipe:", error);
      toast({
        title: "Erreur",
        description: "Impossible de quitter l'équipe: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleLeaveTeam
  };
};
