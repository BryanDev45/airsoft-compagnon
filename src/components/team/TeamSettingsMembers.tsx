
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { Check, X, UserMinus, LogOut } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

interface Profile {
  id: string;
  username?: string;
  avatar?: string;
}

interface TeamMember {
  id: string;
  user_id?: string;
  role?: string;
  status?: string;
  profiles?: Profile;
}

interface TeamData {
  id: string;
  leader_id?: string;
  name: string;
}

interface TeamSettingsMembersProps {
  team: TeamData;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isTeamLeader: boolean;
  user: any;
  onClose: () => void;
}

const TeamSettingsMembers = ({ 
  team, 
  loading, 
  setLoading, 
  isTeamLeader, 
  user,
  onClose
}: TeamSettingsMembersProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingMembers, setPendingMembers] = useState<TeamMember[]>([]);

  // Fetch team members when component mounts
  useEffect(() => {
    fetchTeamMembers();
  }, [team.id]);

  // Function to fetch team members
  const fetchTeamMembers = async () => {
    if (!team?.id) return;
    
    try {
      console.log("Fetching team members for team:", team.id);
      
      // Fetch team members and join with profiles separately to avoid relationship issues
      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select('id, user_id, role, status')
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
    if (!isTeamLeader) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ status: 'confirmed' })
        .eq('id', memberId);
        
      if (error) throw error;
      
      await fetchTeamMembers();
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      
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
    if (!isTeamLeader) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);
        
      if (error) throw error;
      
      await fetchTeamMembers();
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      
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
      
      await fetchTeamMembers();
      
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
      
      await fetchTeamMembers();
      
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

  return (
    <div className="space-y-6">
      {isTeamLeader && pendingMembers.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Demandes d'adhésion en attente ({pendingMembers.length})</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membre</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                      <img 
                        src={member.profiles?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.profiles?.username || 'user'}`} 
                        alt={member.profiles?.username || "Utilisateur"} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span>{member.profiles?.username || "Utilisateur"}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleAcceptMember(member.id)}
                        disabled={loading}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accepter
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRejectMember(member.id)}
                        disabled={loading}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Refuser
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <div>
        <h3 className="font-medium mb-2">Membres de l'équipe ({teamMembers.length})</h3>
        {teamMembers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membre</TableHead>
                {isTeamLeader && <TableHead>Rôle</TableHead>}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                      <img 
                        src={member.profiles?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.profiles?.username || 'user'}`}
                        alt={member.profiles?.username || "Utilisateur"} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span>{member.profiles?.username || "Utilisateur"}</span>
                    {member.user_id === team.leader_id && (
                      <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                        Leader
                      </span>
                    )}
                  </TableCell>
                  
                  {isTeamLeader && (
                    <TableCell>
                      {member.user_id !== team.leader_id && (
                        <ToggleGroup 
                          type="single" 
                          value={member.role || "Membre"}
                          onValueChange={(value) => {
                            if (value) handleUpdateMemberRole(member.id, value);
                          }}
                          className="justify-start"
                        >
                          <ToggleGroupItem value="Membre" size="sm">Membre</ToggleGroupItem>
                          <ToggleGroupItem value="Modérateur" size="sm">Modérateur</ToggleGroupItem>
                          <ToggleGroupItem value="Admin" size="sm">Admin</ToggleGroupItem>
                        </ToggleGroup>
                      )}
                    </TableCell>
                  )}
                  
                  <TableCell>
                    {isTeamLeader && member.user_id !== team.leader_id && member.user_id !== user?.id && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={loading}
                      >
                        <UserMinus className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    )}
                    
                    {!isTeamLeader && member.user_id === user?.id && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleLeaveTeam}
                        disabled={loading}
                      >
                        <LogOut className="h-4 w-4 mr-1" />
                        Quitter
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500 text-center py-4">Aucun membre confirmé dans l'équipe</p>
        )}
      </div>
    </div>
  );
};

export default TeamSettingsMembers;
