
import { useMemo } from 'react';
import { calculateDistance } from '../../utils/mapUtils';
import { MapEvent } from '../useGamesData';

interface FilterParams {
  searchQuery: string;
  selectedType: string;
  selectedDepartment: string;
  selectedDate: Date | undefined;
  selectedCountry: string;
  searchRadius: number[];
  searchCenter: [number, number];
}

export function useEventFiltering() {
  const filterEvents = useMemo(() => {
    return (events: MapEvent[], filters: FilterParams): MapEvent[] => {
      console.log(`Filtering ${events.length} events with filters:`, filters);
      
      const {
        searchQuery,
        selectedType,
        selectedDepartment,
        selectedDate,
        selectedCountry,
        searchRadius,
        searchCenter
      } = filters;

      // Early return if no events
      if (!events || events.length === 0) {
        return [];
      }

      const filtered = events.filter(event => {
        // Search query filter - case insensitive
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesSearch = event.title.toLowerCase().includes(query) || 
                              event.location.toLowerCase().includes(query);
          if (!matchesSearch) return false;
        }
        
        // Type filter
        if (selectedType !== 'all') {
          const matchesType = (selectedType === 'dominicale' && event.type === 'dominicale') ||
                            (selectedType === 'operation' && event.type === 'operation');
          if (!matchesType) return false;
        }
        
        // Department filter
        if (selectedDepartment !== 'all' && event.department !== selectedDepartment) {
          return false;
        }
        
        // Date filter - simplified: only compare with start date
        if (selectedDate) {
          const selectedDateStr = selectedDate.toISOString().split('T')[0];
          if (selectedDateStr !== event.date) {
            return false;
          }
        }
        
        // Country filter - normalized comparison
        if (selectedCountry !== 'all') {
          const normalizedEventCountry = event.country.toLowerCase();
          const normalizedSelectedCountry = selectedCountry.toLowerCase();
          if (normalizedEventCountry !== normalizedSelectedCountry) {
            return false;
          }
        }
        
        // Radius filter - only apply if radius > 0
        if (searchRadius[0] > 0 && searchCenter) {
          const distance = calculateDistance(
            searchCenter[1], 
            searchCenter[0], 
            event.lat, 
            event.lng
          );
          
          if (distance > searchRadius[0]) {
            return false;
          }
        }
        
        return true;
      });

      console.log(`Filtered ${filtered.length} events out of ${events.length}`);
      return filtered;
    };
  }, []); // Empty dependency array since the function doesn't depend on external variables

  return { filterEvents };
}
