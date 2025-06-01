
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { TeamData, TeamMember } from '@/types/team';

export const useTeamMemberActions = (
  team: TeamData,
  user: any,
  isTeamLeader: boolean,
  onClose: () => void,
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>,
  setPendingMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>,
  fetchTeamMembers: () => Promise<void>
) => {
  const navigate = useNavigate();
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
  
  const handleRemoveMember = async (memberId: string) => {
    if (!isTeamLeader) return;
    
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce membre de l'équipe ?")) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);
        
      if (error) throw error;
      
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
      
      toast({
        title: "Membre supprimé",
        description: "Le membre a été supprimé de l'équipe.",
      });
    } catch (error: any) {
      console.error("Erreur lors de la suppression du membre:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le membre: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateMemberRole = async (memberId: string, newRole: string) => {
    if (!isTeamLeader) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ role: newRole })
        .eq('id', memberId);
        
      if (error) throw error;
      
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === memberId 
            ? { ...member, role: newRole } 
            : member
        )
      );
      
      toast({
        title: "Rôle mis à jour",
        description: "Le rôle du membre a été mis à jour avec succès.",
      });
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du rôle:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
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
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', team.id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Équipe quittée",
        description: "Vous avez quitté l'équipe avec succès.",
      });
      
      onClose();
      navigate('/');
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
    setLoading,
    handleAcceptMember,
    handleRejectMember,
    handleRemoveMember,
    handleUpdateMemberRole,
    handleLeaveTeam
  };
};
