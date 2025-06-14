
import { useEffect } from 'react';
import { calculateDistance } from '../utils/mapUtils';
import { MapStore } from './useMapData';
import { useFilterState } from './filters/useFilterState';
import { useCountryCoordinates } from './filters/useCountryCoordinates';
import { detectCountryFromStore } from '../utils/geocoding/countryDetection';

export interface StoreFilterState {
  searchQuery: string;
  selectedCountry: string;
  searchRadius: number[];
  searchCenter: [number, number];
}

export function useStoreFiltering(stores: MapStore[]) {
  const {
    searchQuery,
    setSearchQuery,
    selectedCountry,
    setSelectedCountry,
    searchRadius,
    setSearchRadius,
    searchCenter,
    setSearchCenter
  } = useFilterState();

  const { countryCoordinates, updateSearchCenterForCountry } = useCountryCoordinates();

  // Effect to update search center when country changes
  useEffect(() => {
    updateSearchCenterForCountry(selectedCountry, setSearchCenter);
  }, [selectedCountry]);

  // Enhanced store filtering with country filtering
  const filteredStores = stores.filter(store => {
    const matchesSearch = !searchQuery || 
                        store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        store.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        store.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Country filtering logic
    let matchesCountry = true;
    if (selectedCountry !== 'all') {
      // Detect the country of the store
      const storeCountry = detectCountryFromStore({
        name: store.name,
        address: store.address,
        city: store.city,
        zip_code: store.zip_code
      });
      
      // Normalize country names for comparison
      const normalizeCountryName = (country: string): string => {
        const mapping: { [key: string]: string } = {
          'france': 'france',
          'belgium': 'belgique',
          'belgique': 'belgique',
          'belgië': 'belgique',
          'switzerland': 'suisse',
          'suisse': 'suisse',
          'schweiz': 'suisse',
          'germany': 'allemagne',
          'deutschland': 'allemagne',
          'spain': 'espagne',
          'españa': 'espagne',
          'espagne': 'espagne',
          'italy': 'italie',
          'italia': 'italie',
          'italie': 'italie',
          'poland': 'pologne',
          'polska': 'pologne',
          'pologne': 'pologne',
          'luxembourg': 'luxembourg'
        };
        
        return mapping[country.toLowerCase()] || country.toLowerCase();
      };
      
      const normalizedStoreCountry = normalizeCountryName(storeCountry);
      const normalizedSelectedCountry = normalizeCountryName(selectedCountry);
      
      matchesCountry = normalizedStoreCountry === normalizedSelectedCountry;
      
      console.log('Store filtering - Country check:', {
        storeName: store.name,
        storeCity: store.city,
        detectedCountry: storeCountry,
        normalizedStoreCountry,
        selectedCountry,
        normalizedSelectedCountry,
        matchesCountry
      });
    }
    
    // Radius filtering
    let matchesRadius = true;
    if (searchRadius[0] > 0 && searchCenter) {
      const distance = calculateDistance(
        searchCenter[1], 
        searchCenter[0], 
        store.lat, 
        store.lng
      );
      matchesRadius = distance <= searchRadius[0];
    }
    
    return matchesSearch && matchesCountry && matchesRadius;
  });

  console.log('Store filtering results:', {
    totalStores: stores.length,
    filteredStores: filteredStores.length,
    selectedCountry,
    searchQuery,
    searchRadius: searchRadius[0]
  });

  return {
    searchQuery,
    setSearchQuery,
    selectedCountry,
    setSelectedCountry,
    searchRadius,
    setSearchRadius,
    searchCenter,
    setSearchCenter,
    filteredStores,
    countryCoordinates
  };
}
