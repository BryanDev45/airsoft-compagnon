
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

  console.log(`Fetching ${data?.length || 0} stores for geocoding`);

  const formattedStores = await Promise.all(data?.map(async (store: any) => {
    const storeImage = store.picture1 || store.picture2 || store.picture3 || store.picture4 || store.picture5 || "/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png";
    
    console.log(`Processing store "${store.name}": Address="${store.address}", City="${store.city}", Country detection from full data`);
    
    // Enhanced coordinates validation with store data for better country detection
    const coordinates = await getValidCoordinates(
      store.latitude,
      store.longitude,
      store.address || '',
      store.zip_code || '',
      store.city || '',
      'France', // Default country, will be auto-detected
      store // Pass the full store data for better country detection
    );
    
    console.log(`Store "${store.name}": Final coordinates (${coordinates.latitude}, ${coordinates.longitude})`);
    
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
          console.log(`Updated coordinates for store ${store.name} (${store.id})`);
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
  
  // Filter stores with valid coordinates
  const validStores = formattedStores.filter(store => {
    const isValid = store.lat !== 0 && store.lng !== 0 && 
                   !isNaN(store.lat) && !isNaN(store.lng) &&
                   Math.abs(store.lat) > 0.1 && Math.abs(store.lng) > 0.1;
    
    if (!isValid) {
      console.warn(`Filtering out store "${store.name}" with invalid coordinates: (${store.lat}, ${store.lng})`);
    }
    
    return isValid;
  });
  
  console.log(`Returning ${validStores.length} stores with valid coordinates out of ${formattedStores.length} total stores`);
  
  // Mettre en cache pour 30 minutes
  setStorageWithExpiry(STORES_CACHE_KEY, validStores, CACHE_DURATIONS.MEDIUM);
  
  return validStores;
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
