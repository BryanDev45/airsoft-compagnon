
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for fetching user equipment
 */
export const useUserEquipment = (userId: string | undefined) => {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        const { data: userEquipment, error: equipmentError } = await supabase
          .from('equipment')
          .select('*')
          .eq('user_id', userId);

        if (equipmentError) throw equipmentError;
        
        setEquipment(userEquipment || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching equipment:", error);
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [userId]);

  return {
    equipment,
    setEquipment,
    loading
  };
};
