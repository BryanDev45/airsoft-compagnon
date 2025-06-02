
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { TeamMember } from '@/types/team';

export const useTeamMemberAcceptance = (
  isTeamLeader: boolean,
  setPendingMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>,
  fetchTeamMembers: () => Promise<void>
) => {
  const [loading, setLoading] = useState(false);

  const handleAcceptMember = async (memberId: string) => {
    if (!isTeamLeader || loading) return;
    
    setLoading(true);
    
    try {
      console.log("Accepting member with ID:", memberId);
      
      const { error } = await supabase
        .from('team_members')
        .update({ status: 'confirmed' })
        .eq('id', memberId);
        
      if (error) {
        console.error("Error accepting member:", error);
        toast({
          title: "Erreur",
          description: "Impossible d'accepter le membre: " + error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      console.log("Member accepted successfully, refreshing team members list");
      
      await fetchTeamMembers();
      
      toast({
        title: "Membre accepté",
        description: "Le membre a été accepté dans l'équipe.",
      });
      
    } catch (error: any) {
      console.error("Erreur lors de l'acceptation du membre:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter le membre: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRejectMember = async (memberId: string) => {
    if (!isTeamLeader || loading) return;
    
    setLoading(true);
    
    try {
      console.log("Rejecting member with ID:", memberId);
      
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);
        
      if (error) {
        console.error("Error rejecting member:", error);
        toast({
          title: "Erreur",
          description: "Impossible de rejeter le membre: " + error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      setPendingMembers(prev => prev.filter(member => member.id !== memberId));
      
      toast({
        title: "Membre rejeté",
        description: "La demande d'adhésion a été rejetée.",
      });
      
    } catch (error: any) {
      console.error("Erreur lors du rejet du membre:", error);
      toast({
        title: "Erreur",
        description: "Impossible de rejeter le membre: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleAcceptMember,
    handleRejectMember
  };
};
