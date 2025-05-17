
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { TeamData } from '@/types/team';

export const useTeamSettings = (team: TeamData, onTeamUpdate?: (updatedTeam: Partial<TeamData>) => void) => {
  const [name, setName] = useState(team?.name || '');
  const [location, setLocation] = useState(team?.location || '');
  const [founded, setFounded] = useState(team?.founded ? String(team.founded) : '');
  const [description, setDescription] = useState(team?.description || '');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isRecruitmentOpen, setIsRecruitmentOpen] = useState(team?.is_recruiting || false);
  const [isAssociation, setIsAssociation] = useState(team?.is_association || false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Update state when team props change
    setName(team?.name || '');
    setLocation(team?.location || '');
    setFounded(team?.founded ? String(team.founded) : '');
    setDescription(team?.description || '');
    setIsRecruitmentOpen(team?.is_recruiting || false);
    setIsAssociation(team?.is_association || false);
  }, [team]);

  const handleUpdateTeamInfo = async () => {
    setLoading(true);
    
    try {
      // Convert founded to number or null if it's an empty string
      const foundedValue = founded.trim() !== '' ? Number(founded) : null;
      
      const updatedFields = {
        name,
        location,
        founded: foundedValue,
        description,
        is_association: isAssociation
      };
      
      const { error } = await supabase
        .from('teams')
        .update(updatedFields)
        .eq('id', team.id);
        
      if (error) throw error;
      
      // Notify parent component about the update with updated team object
      if (onTeamUpdate) {
        onTeamUpdate({
          ...team,
          ...updatedFields
        });
      }
      
      toast({
        title: "Équipe mise à jour",
        description: "Les informations de l'équipe ont été mises à jour avec succès.",
      });
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de l'équipe:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations de l'équipe: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDescription = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('teams')
        .update({ description })
        .eq('id', team.id);
        
      if (error) throw error;
      
      // Notify parent component about the update with updated team object
      if (onTeamUpdate) {
        onTeamUpdate({
          ...team,
          description
        });
      }
      
      toast({
        title: "Description mise à jour",
        description: "La description de votre équipe a été mise à jour avec succès.",
      });
      
      setIsEditingBio(false);
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de la description:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la description: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRecruitment = async () => {
    setLoading(true);
    
    try {
      const newStatus = !isRecruitmentOpen;
      
      const { error } = await supabase
        .from('teams')
        .update({ is_recruiting: newStatus })
        .eq('id', team.id);
        
      if (error) throw error;
      
      setIsRecruitmentOpen(newStatus);
      
      if (onTeamUpdate) {
        onTeamUpdate({
          ...team,
          is_recruiting: newStatus
        });
      }
      
      toast({
        title: newStatus ? "Recrutement ouvert" : "Recrutement fermé",
        description: newStatus 
          ? "Le recrutement est maintenant ouvert pour votre équipe." 
          : "Le recrutement est maintenant fermé pour votre équipe.",
      });
    } catch (error: any) {
      console.error("Erreur lors de la modification du statut de recrutement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de recrutement: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAssociation = async () => {
    setLoading(true);
    
    try {
      const newStatus = !isAssociation;
      
      const { error } = await supabase
        .from('teams')
        .update({ is_association: newStatus })
        .eq('id', team.id);
        
      if (error) throw error;
      
      setIsAssociation(newStatus);
      
      if (onTeamUpdate) {
        onTeamUpdate({
          ...team,
          is_association: newStatus
        });
      }
      
      toast({
        title: "Statut mis à jour",
        description: newStatus 
          ? "Votre équipe est maintenant définie comme une association déclarée." 
          : "Votre équipe n'est plus définie comme une association déclarée.",
      });
    } catch (error: any) {
      console.error("Erreur lors de la modification du statut d'association:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut d'association: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    setName,
    location,
    setLocation,
    founded,
    setFounded,
    description,
    setDescription,
    isEditingBio,
    setIsEditingBio,
    isRecruitmentOpen,
    isAssociation,
    loading,
    handleUpdateTeamInfo,
    handleUpdateDescription,
    handleToggleRecruitment,
    handleToggleAssociation
  };
};
