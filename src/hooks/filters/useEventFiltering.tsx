
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
      
      let matchesDate = true;
      if (selectedDate) {
        const selectedDateStr = selectedDate.toISOString().split('T')[0];
        
        // La date est déjà au format ISO YYYY-MM-DD
        const startDateStr = event.date;
        
        // Calculer la date de fin
        let endDateStr = startDateStr; // Par défaut, même jour
        
        if (event.startTime && event.endTime) {
          const startDateTime = new Date(`${startDateStr}T${event.startTime}:00`);
          const endDateTime = new Date(`${startDateStr}T${event.endTime}:00`);
          
          // Si l'heure de fin est antérieure à l'heure de début, la partie se termine le jour suivant
          if (endDateTime < startDateTime) {
            const nextDay = new Date(startDateTime);
            nextDay.setDate(nextDay.getDate() + 1);
            endDateStr = nextDay.toISOString().split('T')[0];
          }
        }
        
        // Vérifier si la date sélectionnée se trouve dans la plage de la partie
        matchesDate = selectedDateStr >= startDateStr && selectedDateStr <= endDateStr;
      }
      
      const matchesCountry = selectedCountry === 'all' || event.country === selectedCountry;
      
      if (searchRadius[0] === 0) {
        return matchesSearch && matchesType && matchesDepartment && matchesDate && matchesCountry;
      }
      
      if (searchCenter && searchRadius[0] > 0) {
        const distance = calculateDistance(
          searchCenter[1], 
          searchCenter[0], 
          event.lat, 
          event.lng
        );
        
        return matchesSearch && matchesType && matchesDepartment && matchesDate && 
               matchesCountry && distance <= searchRadius[0];
      }
      
      return matchesSearch && matchesType && matchesDepartment && matchesDate && matchesCountry;
    });
  };

  return { filterEvents };
}
