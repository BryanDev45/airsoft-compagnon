import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useEquipmentActions = (userId: string | undefined) => {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const fetchEquipment = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      setEquipment(data || []);
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la récupération de l'équipement:", err);
      setError(err as Error);
    }
  }, [userId]);

  const handleAddEquipment = useCallback(async (newEquipment: any) => {
    try {
      const { error } = await supabase
        .from('equipment')
        .insert({
          ...newEquipment,
          user_id: userId
        });

      if (error) throw error;

      toast({
        title: "Équipement ajouté",
        description: "Votre équipement a été ajouté avec succès"
      });

      await fetchEquipment();
      return true;
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'équipement:", err);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'équipement",
        variant: "destructive"
      });
      setError(err as Error);
      return false;
    }
  }, [userId, fetchEquipment]);

  return {
    equipment,
    fetchEquipment,
    handleAddEquipment,
    error,
  };
};
