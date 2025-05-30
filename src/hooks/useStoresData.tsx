
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getValidCoordinates } from '@/utils/geocodingUtils';
import { setStorageWithExpiry, CACHE_DURATIONS } from '@/utils/cacheUtils';
import { MapStore } from './useMapData';

const STORES_CACHE_KEY = 'map_stores_data';

export const fetchStoresData = async (): Promise<MapStore[]> => {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .order('name');

  if (error) throw error;

  const formattedStores = await Promise.all(data?.map(async (store: any) => {
    const storeImage = store.picture1 || store.picture2 || store.picture3 || store.picture4 || store.picture5 || "/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png";
    
    const coordinates = await getValidCoordinates(
      store.latitude,
      store.longitude,
      store.address,
      store.zip_code,
      store.city
    );
    
    // Mettre à jour les coordonnées en arrière-plan si nécessaire
    if (coordinates.latitude !== store.latitude || coordinates.longitude !== store.longitude) {
      (async () => {
        try {
          await supabase
            .from('stores')
            .update({
              latitude: coordinates.latitude,
              longitude: coordinates.longitude
            })
            .eq('id', store.id);
          console.log(`Updated coordinates for store ${store.id}`);
        } catch (error) {
          console.error('Failed to update store coordinates:', error);
        }
      })();
    }
    
    return {
      id: store.id,
      name: store.name,
      address: store.address,
      city: store.city,
      zip_code: store.zip_code,
      phone: store.phone,
      email: store.email,
      website: store.website,
      lat: coordinates.latitude,
      lng: coordinates.longitude,
      store_type: store.store_type || 'physical',
      image: storeImage,
      picture2: store.picture2,
      picture3: store.picture3,
      picture4: store.picture4,
      picture5: store.picture5
    };
  }) || []);
  
  // Mettre en cache pour 30 minutes
  setStorageWithExpiry(STORES_CACHE_KEY, formattedStores, CACHE_DURATIONS.MEDIUM);
  
  return formattedStores;
};

export function useStoresData() {
  return useQuery({
    queryKey: ['mapStores'],
    queryFn: fetchStoresData,
    refetchOnWindowFocus: false,
    staleTime: CACHE_DURATIONS.MEDIUM, // 30 minutes
    gcTime: CACHE_DURATIONS.LONG, // 24 heures
    retry: 1
  });
}
