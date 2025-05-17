import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, LogOut } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { TeamData } from '@/types/team';

interface TeamSettingsDangerProps {
  team: TeamData;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isTeamLeader: boolean;
  user: any;
  onClose: () => void;
}

const TeamSettingsDanger = ({ 
  team, 
  loading, 
  setLoading, 
  isTeamLeader, 
  user,
  onClose
}: TeamSettingsDangerProps) => {
  const navigate = useNavigate();
  
  const handleDeleteTeam = async () => {
    // Only team leaders can delete the team
    if (!isTeamLeader) {
      toast({
        title: "Accès refusé",
        description: "Seul le propriétaire de l'équipe peut supprimer l'équipe.",
        variant: "destructive",
      });
      return;
    }
    
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette équipe ? Cette action est irréversible.")) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Delete all team members first
      const { error: membersError } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', team.id);
        
      if (membersError) throw membersError;
      
      // Then delete the team
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', team.id);
        
      if (error) throw error;
      
      toast({
        title: "Équipe supprimée",
        description: "L'équipe a été supprimée avec succès.",
      });
      
      onClose();
      navigate('/');
    } catch (error: any) {
      console.error("Erreur lors de la suppression de l'équipe:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'équipe: " + error.message,
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
    <div className="space-y-4">
      {!isTeamLeader ? (
        <div className="border rounded-md p-4 bg-red-50 border-red-200">
          <h3 className="font-semibold text-red-700 mb-2">Quitter l'équipe</h3>
          <p className="text-sm text-red-600 mb-4">
            Attention : cette action est irréversible. Vous ne serez plus membre de cette équipe.
          </p>
          
          <Button 
            variant="destructive" 
            onClick={handleLeaveTeam}
            disabled={loading}
            className="flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {loading ? "Traitement..." : "Quitter cette équipe"}
          </Button>
        </div>
      ) : (
        <div className="border rounded-md p-4 bg-red-50 border-red-200">
          <h3 className="font-semibold text-red-700 mb-2">Zone de danger</h3>
          <p className="text-sm text-red-600 mb-4">
            Attention : les actions ci-dessous sont irréversibles et peuvent entraîner la perte définitive de données.
          </p>
          
          <Button 
            variant="destructive" 
            onClick={handleDeleteTeam}
            disabled={loading}
            className="flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {loading ? "Suppression..." : "Supprimer cette équipe"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeamSettingsDanger;
