
import { useEffect } from 'react';
import { calculateDistance } from '../utils/mapUtils';
import { getValidCoordinates } from '../utils/geocodingUtils';
import { MapStore } from './useMapData';
import { useFilterState } from './filters/useFilterState';
import { useCountryCoordinates } from './filters/useCountryCoordinates';

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

  // Enhanced store filtering with improved coordinates
  const filteredStores = stores.filter(store => {
    const matchesSearch = !searchQuery || 
                        store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        store.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        store.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (searchRadius[0] === 0) {
      return matchesSearch;
    }
    
    if (searchCenter && searchRadius[0] > 0) {
      // Use the store's actual coordinates, which should be improved by the geocoding
      const distance = calculateDistance(
        searchCenter[1], 
        searchCenter[0], 
        store.lat, 
        store.lng
      );
      
      return matchesSearch && distance <= searchRadius[0];
    }
    
    return matchesSearch;
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
