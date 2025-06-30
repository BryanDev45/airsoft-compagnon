
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

export const useTeamField = (teamId: string, onFieldUpdate?: () => void) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEdit = useCallback((fieldId: string, fieldData: any) => {
    setIsEditing(true);
    setEditingFieldId(fieldId);
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditingFieldId(null);
  }, []);

  const handleSave = useCallback(async (fieldId: string | null, fieldData: any) => {
    if (!teamId) return;
    
    setLoading(true);
    
    try {
      const dataToSave = {
        name: fieldData.name,
        address: fieldData.address,
        city: fieldData.city,
        zip_code: fieldData.zip_code,
        description: fieldData.description,
        coordinates: fieldData.coordinates,
        team_id: teamId
      };

      if (fieldId) {
        // Update existing field
        const { error } = await supabase
          .from('team_fields')
          .update(dataToSave)
          .eq('id', fieldId);

        if (error) throw error;

        toast({
          title: "Terrain mis à jour",
          description: "Les informations du terrain ont été mises à jour avec succès.",
        });
      } else {
        // Create new field
        const { error } = await supabase
          .from('team_fields')
          .insert([dataToSave]);

        if (error) throw error;

        toast({
          title: "Terrain ajouté",
          description: "Le terrain a été ajouté à votre équipe avec succès.",
        });
      }

      setIsEditing(false);
      setEditingFieldId(null);
      
      if (onFieldUpdate) {
        onFieldUpdate();
      }
    } catch (error: any) {
      console.error('Error saving team field:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde du terrain.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [teamId, onFieldUpdate]);

  return {
    isEditing,
    editingFieldId,
    loading,
    handleEdit,
    handleCancel,
    handleSave
  };
};
