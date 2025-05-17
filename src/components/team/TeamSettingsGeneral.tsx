
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { LockOpen, Lock, PenBox, X, Save } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface TeamData {
  id: string;
  name: string;
  description?: string;
  location?: string;
  founded?: string;
  is_recruiting?: boolean;
  is_association?: boolean;
  leader_id?: string;
}

interface TeamSettingsGeneralProps {
  team: TeamData;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onTeamUpdate?: (updatedTeam: Partial<TeamData>) => void;
}

const TeamSettingsGeneral = ({ team, loading, setLoading, onTeamUpdate }: TeamSettingsGeneralProps) => {
  const { user } = useAuth();
  const [name, setName] = useState(team?.name || '');
  const [location, setLocation] = useState(team?.location || '');
  const [founded, setFounded] = useState(team?.founded || '');
  const [description, setDescription] = useState(team?.description || '');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isRecruitmentOpen, setIsRecruitmentOpen] = useState(team?.is_recruiting || false);
  const [isAssociation, setIsAssociation] = useState(team?.is_association || false);
  const [isTeamLeader, setIsTeamLeader] = useState(false);
  
  // Check if the current user is the team leader
  useEffect(() => {
    if (user && team) {
      setIsTeamLeader(user.id === team.leader_id);
    }
  }, [user, team]);

  const handleUpdateTeamInfo = async () => {
    setLoading(true);
    
    try {
      const updatedFields = {
        name,
        location,
        founded,
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
    if (!isTeamLeader) return;
    
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
    if (!isTeamLeader) return;
    
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

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nom de l'équipe</label>
        <Input 
          value={name} 
          onChange={e => setName(e.target.value)}
          placeholder="Nom de l'équipe"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Localisation</label>
        <Input 
          value={location} 
          onChange={e => setLocation(e.target.value)}
          placeholder="Localisation"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Date de fondation</label>
        <Input 
          value={founded} 
          onChange={e => setFounded(e.target.value)}
          placeholder="Année de fondation"
          type="number"
          min="1990"
          max="2099"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Description de l'équipe</label>
        {isEditingBio ? (
          <div className="space-y-2">
            <Textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              placeholder="Description de l'équipe"
              className="h-32"
            />
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setDescription(team.description || '');
                  setIsEditingBio(false);
                }}
              >
                <X className="h-4 w-4 mr-1" />
                Annuler
              </Button>
              
              <Button 
                size="sm"
                onClick={handleUpdateDescription}
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-1" />
                {loading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="border rounded-md p-3 bg-gray-50 min-h-[100px]">
              {description || <span className="text-gray-400 italic">Aucune description</span>}
            </div>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 text-gray-600 hover:text-gray-900"
              onClick={() => setIsEditingBio(true)}
            >
              <PenBox className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      {isTeamLeader && (
        <>
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Statut du recrutement</h3>
                <p className="text-sm text-gray-500">
                  Autorisez de nouveaux membres à rejoindre votre équipe
                </p>
              </div>
              
              <div className="flex items-center">
                <Switch 
                  checked={isRecruitmentOpen} 
                  onCheckedChange={handleToggleRecruitment}
                  disabled={loading}
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2"
                  onClick={handleToggleRecruitment}
                  disabled={loading}
                >
                  {isRecruitmentOpen ? (
                    <>
                      <Lock className="h-4 w-4 mr-1" />
                      Fermer
                    </>
                  ) : (
                    <>
                      <LockOpen className="h-4 w-4 mr-1" />
                      Ouvrir
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Association déclarée</h3>
                <p className="text-sm text-gray-500">
                  Indiquer si votre équipe est une association loi 1901 déclarée
                </p>
              </div>
              
              <div className="flex items-center">
                <Switch 
                  checked={isAssociation} 
                  onCheckedChange={handleToggleAssociation}
                  disabled={loading}
                />
                <span className="ml-2 text-sm font-medium">
                  {isAssociation ? "Oui" : "Non"}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
      
      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleUpdateTeamInfo}
          disabled={loading}
        >
          {loading ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>
    </div>
  );
};

export default TeamSettingsGeneral;
