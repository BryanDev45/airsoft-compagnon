
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
        
        // Extraire la date de début depuis event.date (format français DD/MM/YYYY)
        let startDate: Date;
        if (event.date.includes('/')) {
          // Format français DD/MM/YYYY
          const [day, month, year] = event.date.split('/');
          startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
          // Format ISO ou autre
          startDate = new Date(event.date);
        }
        
        // Calculer la date de fin en utilisant endTime
        let endDate = new Date(startDate);
        if (event.endTime) {
          const [endHours, endMinutes] = event.endTime.split(':');
          endDate.setHours(parseInt(endHours), parseInt(endMinutes));
          
          // Si l'heure de fin est antérieure à l'heure de début, la partie se termine le jour suivant
          const startHours = startDate.getHours();
          if (parseInt(endHours) < startHours || (parseInt(endHours) === startHours && parseInt(endMinutes) < startDate.getMinutes())) {
            endDate.setDate(endDate.getDate() + 1);
          }
        }
        
        // Vérifier si la date sélectionnée se trouve dans la plage de la partie
        const selectedDateObj = new Date(selectedDateStr);
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        
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
