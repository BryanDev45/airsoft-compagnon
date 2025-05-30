
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { TeamData, TeamMember } from '@/types/team';
import { useNavigate } from 'react-router-dom';
import { useTeamPermissions } from './useTeamPermissions';

export const useTeamMembers = (
  team: TeamData, 
  user: any, 
  isTeamLeader: boolean, 
  onClose: () => void
) => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingMembers, setPendingMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Utiliser les permissions d'équipe
  const permissions = useTeamPermissions(team?.id || null);

  // Fetch team members when component mounts
  useEffect(() => {
    if (team?.id) {
      fetchTeamMembers();
    }
  }, [team?.id]);

  // Function to fetch team members
  const fetchTeamMembers = async () => {
    if (!team?.id) return;
    
    try {
      console.log("Fetching team members for team:", team.id);
      
      // Fetch team members and join with profiles separately to avoid relationship issues
      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select('id, user_id, team_id, role, status')
        .eq('team_id', team.id);
        
      if (membersError) {
        console.error('Error fetching members:', membersError);
        toast({
          title: "Erreur",
          description: "Impossible de charger les membres de l'équipe: " + membersError.message,
          variant: "destructive"
        });
        return;
      }

      console.log("Team members data:", membersData);
      
      if (!Array.isArray(membersData) || membersData.length === 0) {
        console.log('No team members found');
        setTeamMembers([]);
        setPendingMembers([]);
        return;
      }
      
      // Get all user IDs from team members
      const userIds = membersData.map(member => member.user_id).filter(Boolean);
      
      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar')
        .in('id', userIds);
        
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }
      
      // Map profiles to team members
      const membersWithProfiles: TeamMember[] = membersData.map(member => {
        const profile = profilesData?.find(p => p.id === member.user_id) || {
          id: member.user_id || '',
          username: 'Utilisateur',
          avatar: null
        };
        
        return {
          ...member,
          profiles: profile
        };
      });
      
      // Filter confirmed and pending members
      const confirmed = membersWithProfiles.filter(m => m.status === 'confirmed') || [];
      const pending = membersWithProfiles.filter(m => m.status === 'pending') || [];
      
      console.log("Confirmed members:", confirmed);
      console.log("Pending members:", pending);
      
      setTeamMembers(confirmed);
      setPendingMembers(pending);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des membres:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les membres de l'équipe: " + error.message,
        variant: "destructive"
      });
    }
  };

  const handleAcceptMember = async (memberId: string) => {
    // Vérifier les permissions
    if (!permissions.canAcceptMembers || loading) {
      toast({
        title: "Permission refusée",
        description: "Vous n'avez pas les permissions nécessaires pour accepter des membres.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Accepting member with ID:", memberId);
      
      // First update the database
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
      
      // Only update the UI if the database update was successful
      setPendingMembers(prev => {
        // Find the accepted member
        const acceptedMember = prev.find(m => m.id === memberId);
        if (!acceptedMember) return prev;
        
        // Create a copy of the member with updated status
        const updatedMember = { ...acceptedMember, status: 'confirmed' };
        
        // Add the member to the confirmed members list
        setTeamMembers(currentMembers => [...currentMembers, updatedMember]);
        
        // Return pending members without the accepted one
        return prev.filter(m => m.id !== memberId);
      });
      
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
    // Vérifier les permissions
    if (!permissions.canAcceptMembers || loading) {
      toast({
        title: "Permission refusée",
        description: "Vous n'avez pas les permissions nécessaires pour rejeter des membres.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      console.log("Rejecting member with ID:", memberId);
      
      // Make sure to wait for the database operation to complete
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
      
      // Only update the UI if the database operation was successful
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
    // Vérifier les permissions
    if (!permissions.canManageTeam) {
      toast({
        title: "Permission refusée",
        description: "Vous n'avez pas les permissions nécessaires pour supprimer des membres.",
        variant: "destructive",
      });
      return;
    }
    
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
      
      // Immédiatement mettre à jour l'état local pour refléter le changement
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
    // Vérifier les permissions
    if (!permissions.canManageTeam) {
      toast({
        title: "Permission refusée",
        description: "Vous n'avez pas les permissions nécessaires pour modifier les rôles.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ role: newRole })
        .eq('id', memberId);
        
      if (error) throw error;
      
      // Mettre à jour l'état local pour refléter le changement
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
    
    // Prevent the team leader from leaving without transferring ownership
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
    teamMembers,
    pendingMembers,
    loading,
    setLoading,
    fetchTeamMembers,
    handleAcceptMember,
    handleRejectMember,
    handleRemoveMember,
    handleUpdateMemberRole,
    handleLeaveTeam,
    permissions
  };
};
