
import { useState, useEffect } from 'react';
import { calculateDistance } from '../utils/mapUtils';
import { MapStore } from './useMapData';

export interface StoreFilterState {
  searchQuery: string;
  selectedCountry: string;
  searchRadius: number[];
  searchCenter: [number, number];
}

export function useStoreFiltering(stores: MapStore[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('france');
  const [searchRadius, setSearchRadius] = useState([0]);
  const [searchCenter, setSearchCenter] = useState<[number, number]>([2.3522, 46.2276]);
  const [isMapView, setIsMapView] = useState(true);
  const [selectedStore, setSelectedStore] = useState<MapStore | null>(null);

  const countryCoordinates: Record<string, [number, number]> = {
    france: [2.3522, 46.2276],
    belgique: [4.3517, 50.8503],
    suisse: [8.2275, 46.8182],
    allemagne: [10.4515, 51.1657],
    espagne: [-3.7492, 40.4637],
    italie: [12.5674, 41.8719]
  };

  // Effect to update search center when country changes
  useEffect(() => {
    if (selectedCountry !== 'all' && countryCoordinates[selectedCountry]) {
      setSearchCenter(countryCoordinates[selectedCountry]);
    }
  }, [selectedCountry]);

  const filteredStores = stores.filter(store => {
    const matchesSearch = !searchQuery || 
                        store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        store.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        store.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (searchRadius[0] === 0) {
      return matchesSearch;
    }
    
    if (searchCenter && searchRadius[0] > 0) {
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
    selectedDepartment,
    setSelectedDepartment,
    selectedCountry,
    setSelectedCountry,
    searchRadius,
    setSearchRadius,
    searchCenter,
    setSearchCenter,
    isMapView,
    setIsMapView,
    selectedStore,
    setSelectedStore,
    filteredStores,
    countryCoordinates
  };
}
