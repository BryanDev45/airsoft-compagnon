
import { useMemo, useEffect, useRef } from 'react';
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
  
  // Track if this is the initial load to prevent unnecessary recentering
  const initialLoadComplete = useRef(false);
  const lastCountry = useRef(selectedCountry);

  // Handle search center updates when country changes - only on significant changes
  useEffect(() => {
    // Only update search center if country actually changed and it's not the initial load
    if (initialLoadComplete.current && lastCountry.current !== selectedCountry) {
      console.log('Country changed from', lastCountry.current, 'to', selectedCountry, '- updating search center...');
      updateSearchCenterForCountry(selectedCountry, setSearchCenter);
    }
    
    lastCountry.current = selectedCountry;
    
    if (!initialLoadComplete.current) {
      initialLoadComplete.current = true;
    }
  }, [selectedCountry, updateSearchCenterForCountry]);

  // Memoize filtered events to prevent unnecessary recalculations
  const filteredEvents = useMemo(() => {
    console.log('Recalculating filtered events...');
    
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
    filterEvents
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
