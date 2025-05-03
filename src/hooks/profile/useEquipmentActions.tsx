
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useEquipmentActions = (userId: string | undefined) => {
  const [equipment, setEquipment] = useState<any[]>([]);

  const fetchEquipment = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      setEquipment(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'équipement:", error);
    }
  };

  const handleAddEquipment = async (newEquipment: any) => {
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
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'équipement:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'équipement",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    equipment,
    fetchEquipment,
    handleAddEquipment
  };
};
