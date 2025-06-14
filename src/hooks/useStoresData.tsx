
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getValidCoordinates } from "@/utils/geocodingUtils";

export interface MapStore {
  id: string;
  name: string;
  address: string;
  city: string;
  zip_code: string;
  phone?: string;
  email?: string;
  website?: string;
  lat: number;
  lng: number;
  store_type: string;
  image: string;
  picture2?: string;
  picture3?: string;
  picture4?: string;
  picture5?: string;
}

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
        (stores || []).map(async (store) => {
          const isTaiwangun = store.name.toLowerCase().includes('taiwangun');
          
          if (isTaiwangun) {
            console.log(`🔍 TAIWANGUN DEBUG - Processing store:`, {
              name: store.name,
              address: store.address,
              city: store.city,
              zip_code: store.zip_code,
              stored_coords: { lat: store.latitude, lng: store.longitude }
            });
          }
          
          console.log(`🔍 STORES DEBUG: Processing store "${store.name}": Address="${store.address}", City="${store.city}", ZIP="${store.zip_code}", Stored coords=(${store.latitude}, ${store.longitude})`);
          
          // Special handling for Polish addresses - force geocoding if coordinates seem to be default Paris coordinates
          const isPolishAddress = (store.address && (store.address.includes('ł') || store.address.includes('ą') || store.address.includes('ę') || store.address.includes('ć') || store.address.includes('ń') || store.address.includes('ó') || store.address.includes('ś') || store.address.includes('ź') || store.address.includes('ż'))) ||
                                 (store.city && (store.city.toLowerCase().includes('krakow') || store.city.toLowerCase().includes('kraków') || store.city.toLowerCase().includes('warszawa') || store.city.toLowerCase().includes('gdansk') || store.city.toLowerCase().includes('gdańsk'))) ||
                                 (store.zip_code && /^\d{2}-\d{3}$/.test(store.zip_code));
          
          const isProbablyDefaultCoords = (store.latitude === 48.8566 && store.longitude === 2.3522) || // Paris default
                                         (Math.abs(store.latitude - 48.8566) < 0.001 && Math.abs(store.longitude - 2.3522) < 0.001);
          
          let shouldForceGeocode = false;
          
          if (isPolishAddress && isProbablyDefaultCoords) {
            console.log(`🔍 STORES DEBUG: Store "${store.name}" appears to have Polish address but Paris coordinates - forcing geocoding`);
            shouldForceGeocode = true;
          }
          
          // For Taiwangun specifically, always force geocoding to ensure we get correct coordinates
          if (isTaiwangun) {
            console.log(`🔍 TAIWANGUN DEBUG - Forcing geocoding for Taiwangun store`);
            shouldForceGeocode = true;
          }
          
          // Use stored coordinates if they seem valid, otherwise geocode
          const validCoordinates = await getValidCoordinates(
            shouldForceGeocode ? null : store.latitude, // Force geocoding if needed
            shouldForceGeocode ? null : store.longitude,
            store.address || '',
            store.zip_code || '',
            store.city || '',
            'France', // Default country
            {
              name: store.name,
              address: store.address,
              city: store.city,
              zip_code: store.zip_code
            }
          );

          if (isTaiwangun) {
            console.log(`🔍 TAIWANGUN DEBUG - Final coordinates after getValidCoordinates:`, validCoordinates);
          }

          console.log(`🔍 STORES DEBUG: Store "${store.name}": Final coordinates (${validCoordinates.latitude}, ${validCoordinates.longitude})`);

          const processedStore = {
            id: store.id,
            name: store.name,
            address: store.address || '',
            city: store.city || '',
            zip_code: store.zip_code || '',
            phone: store.phone,
            email: store.email,
            website: store.website,
            lat: validCoordinates.latitude,
            lng: validCoordinates.longitude,
            store_type: store.store_type || '',
            image: store.picture1 || '/placeholder.svg',
            picture2: store.picture2,
            picture3: store.picture3,
            picture4: store.picture4,
            picture5: store.picture5
          };

          if (isTaiwangun) {
            console.log(`🔍 TAIWANGUN DEBUG - Processed store object:`, processedStore);
          }

          return processedStore;
        })
      );

      console.log(`🔍 STORES DEBUG: Processed ${processedStores.length} stores`);

      // Filter stores with valid coordinates with detailed logging
      const validStores = processedStores.filter(store => {
        const isValid = store.lat !== 0 && store.lng !== 0 && 
                       !isNaN(store.lat) && !isNaN(store.lng) &&
                       Math.abs(store.lat) > 0.1 && Math.abs(store.lng) > 0.1;
        
        const isTaiwangun = store.name.toLowerCase().includes('taiwangun');
        
        if (!isValid) {
          console.warn(`🔍 STORES DEBUG: Filtering out store "${store.name}" with invalid coordinates: (${store.lat}, ${store.lng})`);
          if (isTaiwangun) {
            console.log(`🔍 TAIWANGUN DEBUG - Store FILTERED OUT due to invalid coordinates!`, {
              coordinates: { lat: store.lat, lng: store.lng },
              validation: {
                notZero: store.lat !== 0 && store.lng !== 0,
                notNaN: !isNaN(store.lat) && !isNaN(store.lng),
                magnitude: Math.abs(store.lat) > 0.1 && Math.abs(store.lng) > 0.1
              }
            });
          }
        }
        
        if (isTaiwangun) {
          console.log(`🔍 TAIWANGUN DEBUG - Store validation result:`, {
            name: store.name,
            coordinates: { lat: store.lat, lng: store.lng },
            isValid,
            willBeIncluded: isValid
          });
        }
        
        return isValid;
      });

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
