
import { useState, useEffect } from 'react';
import { calculateDistance } from '../utils/mapUtils';
import { MapEvent } from './useMapData';

export interface FilterState {
  searchQuery: string;
  selectedType: string;
  selectedDepartment: string;
  selectedDate: string;
  selectedCountry: string;
  searchRadius: number[];
  searchCenter: [number, number];
}

export function useMapFiltering(events: MapEvent[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('france');
  const [searchRadius, setSearchRadius] = useState([0]);
  const [searchCenter, setSearchCenter] = useState<[number, number]>([2.3522, 46.2276]);

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

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || 
                        (selectedType === 'dominicale' && event.type === 'dominicale') ||
                        (selectedType === 'operation' && event.type === 'operation');
    const matchesDepartment = selectedDepartment === 'all' || event.department === selectedDepartment;
    
    // Fix the date matching logic
    let matchesDate = true;
    if (selectedDate) {
      // Compare only the date part (YYYY-MM-DD) without time
      const eventDateStr = event.date.split('/').reverse().join('-'); // Convert DD/MM/YYYY to YYYY-MM-DD
      matchesDate = eventDateStr === selectedDate;
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
