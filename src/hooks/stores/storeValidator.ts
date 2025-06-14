
import { MapStore } from "./types";

export const isValidStore = (store: MapStore): boolean => {
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
};
