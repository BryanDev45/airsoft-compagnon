
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useEquipmentActions = (userId: string | undefined) => {
  const [userEquipment, setUserEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserEquipment = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      setUserEquipment(data || []);
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la récupération de l'équipement:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addUserEquipment = useCallback(async (equipmentData: any) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('equipment')
        .insert({
          ...equipmentData,
          user_id: userId
        });

      if (error) throw error;

      toast({
        title: "Équipement ajouté",
        description: "Votre équipement a été ajouté avec succès"
      });

      await fetchUserEquipment();
      return true;
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'équipement:", err);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'équipement",
        variant: "destructive"
      });
      return false;
    }
  }, [userId, fetchUserEquipment]);

  const updateUserEquipment = useCallback(async (id: string, equipmentData: any) => {
    try {
      const { error } = await supabase
        .from('equipment')
        .update(equipmentData)
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Équipement mis à jour",
        description: "Votre équipement a été mis à jour avec succès"
      });

      await fetchUserEquipment();
      return true;
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'équipement:", err);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'équipement",
        variant: "destructive"
      });
      return false;
    }
  }, [userId, fetchUserEquipment]);

  const deleteUserEquipment = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Équipement supprimé",
        description: "Votre équipement a été supprimé avec succès"
      });

      await fetchUserEquipment();
      return true;
    } catch (err) {
      console.error("Erreur lors de la suppression de l'équipement:", err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'équipement",
        variant: "destructive"
      });
      return false;
    }
  }, [userId, fetchUserEquipment]);

  return {
    userEquipment,
    loading,
    error,
    fetchUserEquipment,
    addUserEquipment,
    updateUserEquipment,
    deleteUserEquipment
  };
};

export default useEquipmentActions;
