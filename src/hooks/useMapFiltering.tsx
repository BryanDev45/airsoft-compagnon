
import { useMemo } from 'react';
import { MapEvent } from './useGamesData';
import { useFilterState } from './filters/useFilterState';
import { useEventFilters } from './filters/useEventFilters';
import { useCountryCoordinates } from './filters/useCountryCoordinates';
import { useEventFiltering } from './filters/useEventFiltering';

export interface FilterState {
  searchQuery: string;
  selectedType: string;
  selectedDepartment: string;
  selectedDate: Date | undefined;
  selectedCountry: string;
  searchRadius: number[];
  searchCenter: [number, number];
}

export function useMapFiltering(events: MapEvent[]) {
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

  const {
    selectedType,
    setSelectedType,
    selectedDepartment,
    setSelectedDepartment,
    selectedDate,
    setSelectedDate
  } = useEventFilters();

  const { countryCoordinates, updateSearchCenterForCountry } = useCountryCoordinates();
  const { filterEvents } = useEventFiltering();

  // Memoize filtered events to prevent unnecessary recalculations
  const filteredEvents = useMemo(() => {
    console.log('Recalculating filtered events...');
    
    // Update search center when country changes
    updateSearchCenterForCountry(selectedCountry, setSearchCenter);
    
    return filterEvents(events, {
      searchQuery,
      selectedType,
      selectedDepartment,
      selectedDate,
      selectedCountry,
      searchRadius,
      searchCenter
    });
  }, [
    events, 
    searchQuery, 
    selectedType, 
    selectedDepartment, 
    selectedDate, 
    selectedCountry, 
    searchRadius, 
    searchCenter,
    filterEvents,
    updateSearchCenterForCountry
  ]);

  return {
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedDepartment,
    setSelectedDepartment,
    selectedDate,
    setSelectedDate,
    selectedCountry,
    setSelectedCountry,
    searchRadius,
    setSearchRadius,
    searchCenter,
    setSearchCenter,
    filteredEvents,
    countryCoordinates
  };
}
