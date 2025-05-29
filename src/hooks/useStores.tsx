
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { MapStore } from './useMapData';

export const useStores = () => {
  const [stores, setStores] = useState<MapStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('name');

      if (error) throw error;
      
      const mappedStores: MapStore[] = (data || []).map(store => ({
        id: store.id,
        name: store.name,
        address: store.address,
        city: store.city,
        zip_code: store.zip_code,
        phone: store.phone,
        email: store.email,
        website: store.website,
        lat: store.latitude || 0,
        lng: store.longitude || 0,
        image: store.picture1 || store.picture2 || store.picture3 || store.picture4 || store.picture5 || "/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png"
      }));
      
      setStores(mappedStores);
    } catch (error) {
      console.error('Error fetching stores:', error);
      const errorMessage = 'Impossible de charger les magasins';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
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
    error,
    refetch: fetchStores
  };
};
