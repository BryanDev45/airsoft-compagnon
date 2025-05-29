
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface Store {
  id: string;
  name: string;
  address: string;
  zip_code: string;
  city: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude: number;
  longitude: number;
  picture1?: string;
  picture2?: string;
  picture3?: string;
  picture4?: string;
  picture5?: string;
  created_at: string;
  created_by: string;
}

export const useStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('name');

      if (error) throw error;
      setStores(data || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les magasins",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return {
    stores,
    loading,
    refetch: fetchStores
  };
};
