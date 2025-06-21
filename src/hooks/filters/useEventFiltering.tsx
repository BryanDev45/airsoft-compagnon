
import { calculateDistance } from '../../utils/mapUtils';
import { MapEvent } from '../useMapData';

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
  const filterEvents = (events: MapEvent[], filters: FilterParams): MapEvent[] => {
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

    const filtered = events.filter(event => {
      // Search query filter
      const matchesSearch = !searchQuery || 
                          event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Type filter
      const matchesType = selectedType === 'all' || 
                          (selectedType === 'dominicale' && event.type === 'dominicale') ||
                          (selectedType === 'operation' && event.type === 'operation');
      
      // Department filter
      const matchesDepartment = selectedDepartment === 'all' || event.department === selectedDepartment;
      
      // Date filter - simplified: only compare with start date
      let matchesDate = true;
      if (selectedDate) {
        const selectedDateStr = selectedDate.toISOString().split('T')[0];
        const gameStartDate = event.date; // Format ISO YYYY-MM-DD
        matchesDate = selectedDateStr === gameStartDate;
      }
      
      // Country filter - normalized comparison
      let matchesCountry = true;
      if (selectedCountry !== 'all') {
        const normalizedEventCountry = event.country.toLowerCase();
        const normalizedSelectedCountry = selectedCountry.toLowerCase();
        matchesCountry = normalizedEventCountry === normalizedSelectedCountry;
      }
      
      // Future date filter - only show future games by default
      let matchesFutureDate = true;
      if (!selectedDate) {
        const today = new Date().toISOString().split('T')[0];
        matchesFutureDate = event.date > today; // Exclude today and past dates
      }
      
      // Radius filter
      if (searchRadius[0] === 0) {
        return matchesSearch && matchesType && matchesDepartment && matchesDate && 
               matchesCountry && matchesFutureDate;
      }
      
      if (searchCenter && searchRadius[0] > 0) {
        const distance = calculateDistance(
          searchCenter[1], 
          searchCenter[0], 
          event.lat, 
          event.lng
        );
        
        return matchesSearch && matchesType && matchesDepartment && matchesDate && 
               matchesCountry && matchesFutureDate && distance <= searchRadius[0];
      }
      
      return matchesSearch && matchesType && matchesDepartment && matchesDate && 
             matchesCountry && matchesFutureDate;
    });

    console.log(`Filtered ${filtered.length} events out of ${events.length}`);
    return filtered;
  };

  return { filterEvents };
}
