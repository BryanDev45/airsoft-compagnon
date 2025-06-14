
import { getValidCoordinates } from "@/utils/geocodingUtils";
import { MapStore, RawStoreData } from "./types";
import { TAIWANGUN_COORDINATES } from "./constants";

export const processStore = async (store: RawStoreData): Promise<MapStore> => {
  const isTaiwangun = store.name.toLowerCase().includes('taiwangun');
  
  if (isTaiwangun) {
    console.log(`🔍 TAIWANGUN DEBUG - Processing store:`, {
      name: store.name,
      address: store.address,
      city: store.city,
      zip_code: store.zip_code,
      stored_coords: { lat: store.latitude, lng: store.longitude }
    });
    
    // Pour Taiwangun, utiliser TOUJOURS les coordonnées hardcodées
    console.log(`🔍 TAIWANGUN DEBUG - Using hardcoded Kraków coordinates:`, TAIWANGUN_COORDINATES);
    
    const processedStore = {
      id: store.id,
      name: store.name,
      address: store.address || '',
      city: store.city || '',
      zip_code: store.zip_code || '',
      phone: store.phone,
      email: store.email,
      website: store.website,
      lat: TAIWANGUN_COORDINATES.latitude,
      lng: TAIWANGUN_COORDINATES.longitude,
      store_type: store.store_type || '',
      image: store.picture1 || '/placeholder.svg',
      picture2: store.picture2,
      picture3: store.picture3,
      picture4: store.picture4,
      picture5: store.picture5
    };

    console.log(`🔍 TAIWANGUN DEBUG - Final processed store:`, processedStore);
    return processedStore;
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

  console.log(`🔍 STORES DEBUG: Store "${store.name}": Final coordinates (${validCoordinates.latitude}, ${validCoordinates.longitude})`);

  return {
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
};
