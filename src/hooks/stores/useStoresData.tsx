
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MapStore, RawStoreData } from "./types";
import { processStore } from "./storeProcessor";
import { isValidStore } from "./storeValidator";

export type { MapStore } from "./types";

export const useStoresData = () => {
  return useQuery({
    queryKey: ['stores'],
    queryFn: async (): Promise<MapStore[]> => {
      console.log('🔍 STORES DEBUG: Fetching stores data...');
      
      const { data: stores, error } = await supabase
        .from('stores')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('🔍 STORES DEBUG: Error fetching stores:', error);
        throw error;
      }
      
      console.log(`🔍 STORES DEBUG: Raw data fetched - ${stores?.length || 0} stores from database`);
      
      // Log all store names to see if Taiwangun is in the raw data
      if (stores) {
        console.log('🔍 STORES DEBUG: All store names from database:', stores.map(s => s.name));
        
        // Check specifically for Taiwangun in raw data
        const taiwangunRaw = stores.find(s => s.name.toLowerCase().includes('taiwangun'));
        if (taiwangunRaw) {
          console.log('🔍 TAIWANGUN DEBUG: Found in raw database data:', {
            name: taiwangunRaw.name,
            address: taiwangunRaw.address,
            city: taiwangunRaw.city,
            zip_code: taiwangunRaw.zip_code,
            stored_coords: { lat: taiwangunRaw.latitude, lng: taiwangunRaw.longitude }
          });
        } else {
          console.log('🔍 TAIWANGUN DEBUG: NOT found in raw database data');
        }
      }
      
      // Process each store to ensure valid coordinates
      const processedStores = await Promise.all(
        (stores || []).map(async (store: RawStoreData) => {
          return await processStore(store);
        })
      );

      console.log(`🔍 STORES DEBUG: Processed ${processedStores.length} stores`);

      // Filter stores with valid coordinates with detailed logging
      const validStores = processedStores.filter(isValidStore);

      console.log(`🔍 STORES DEBUG: Returning ${validStores.length} stores with valid coordinates out of ${processedStores.length} total stores`);
      
      // Final check for Taiwangun in results
      const taiwangunStore = validStores.find(store => store.name.toLowerCase().includes('taiwangun'));
      if (taiwangunStore) {
        console.log(`🔍 TAIWANGUN DEBUG - Final store in results:`, {
          name: taiwangunStore.name,
          address: taiwangunStore.address,
          city: taiwangunStore.city,
          coordinates: { lat: taiwangunStore.lat, lng: taiwangunStore.lng }
        });
      } else {
        console.log(`🔍 TAIWANGUN DEBUG - Taiwangun store NOT found in final results`);
        console.log(`🔍 TAIWANGUN DEBUG - Final store list:`, validStores.map(s => s.name));
      }
      
      return validStores;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
