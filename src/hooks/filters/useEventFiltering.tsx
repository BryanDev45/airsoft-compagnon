
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
    const {
      searchQuery,
      selectedType,
      selectedDepartment,
      selectedDate,
      selectedCountry,
      searchRadius,
      searchCenter
    } = filters;

    return events.filter(event => {
      const matchesSearch = !searchQuery || 
                          event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === 'all' || 
                          (selectedType === 'dominicale' && event.type === 'dominicale') ||
                          (selectedType === 'operation' && event.type === 'operation');
      
      const matchesDepartment = selectedDepartment === 'all' || event.department === selectedDepartment;
      
      // Filtrage simplifié par date : on compare seulement avec la date de début
      let matchesDate = true;
      if (selectedDate) {
        const selectedDateStr = selectedDate.toISOString().split('T')[0];
        const gameStartDate = event.date; // Format ISO YYYY-MM-DD
        
        // On vérifie simplement si la date sélectionnée correspond à la date de début de la partie
        matchesDate = selectedDateStr === gameStartDate;
      }
      
      // Correction du filtrage par pays - normalisation des noms de pays
      let matchesCountry = true;
      if (selectedCountry !== 'all') {
        const normalizedEventCountry = event.country.toLowerCase();
        const normalizedSelectedCountry = selectedCountry.toLowerCase();
        matchesCountry = normalizedEventCountry === normalizedSelectedCountry;
      }
      
      // Filtrage par défaut : ne montrer que les parties à venir (sauf si une date spécifique est sélectionnée)
      let matchesFutureDate = true;
      if (!selectedDate) {
        const today = new Date().toISOString().split('T')[0];
        matchesFutureDate = event.date >= today;
      }
      
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
  };

  return { filterEvents };
}
