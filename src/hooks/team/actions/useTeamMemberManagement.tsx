
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { TeamMember } from '@/types/team';

export const useTeamMemberManagement = (
  isTeamLeader: boolean,
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>
) => {
  const [loading, setLoading] = useState(false);

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

  const handleUpdateMemberGameRole = async (memberId: string, newGameRole: string) => {
    if (!isTeamLeader) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ game_role: newGameRole })
        .eq('id', memberId);
        
      if (error) throw error;
      
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === memberId 
            ? { ...member, game_role: newGameRole } 
            : member
        )
      );
      
      toast({
        title: "Rôle en jeu mis à jour",
        description: "Le rôle en jeu du membre a été mis à jour avec succès.",
      });
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du rôle en jeu:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle en jeu: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMemberAssociationRole = async (memberId: string, newAssociationRole: string) => {
    if (!isTeamLeader) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ association_role: newAssociationRole })
        .eq('id', memberId);
        
      if (error) throw error;
      
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === memberId 
            ? { ...(member as any), association_role: newAssociationRole } 
            : member
        )
      );
      
      toast({
        title: "Rôle associatif mis à jour",
        description: "Le rôle associatif du membre a été mis à jour avec succès.",
      });
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du rôle associatif:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle associatif: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleRemoveMember,
    handleUpdateMemberRole,
    handleUpdateMemberGameRole,
    handleUpdateMemberAssociationRole
  };
};
