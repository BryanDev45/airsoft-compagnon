
import React, { useState, useRef, useEffect } from 'react';
import { Search, Calendar, Map as MapIcon, MapPin, Maximize, Navigation } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Slider } from "@/components/ui/slider";
import MapComponent from './map/MapComponent';
import EventCard from './map/EventCard';
import MapFilters from './map/MapFilters';
import { calculateDistance } from '../utils/mapUtils';

const MapSection = () => {
  const mapContainer = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('france');
  const [searchRadius, setSearchRadius] = useState([50]);
  const [searchCenter, setSearchCenter] = useState([2.3522, 46.2276]); // Default to center of France

  // Country coordinates (centers)
  const countryCoordinates = {
    france: [2.3522, 46.2276],
    belgique: [4.3517, 50.8503],
    suisse: [8.2275, 46.8182],
    allemagne: [10.4515, 51.1657],
    espagne: [-3.7492, 40.4637],
    italie: [12.5674, 41.8719]
  };

  // Simulons des données de parties d'airsoft
  const [events] = useState([{
    id: 1,
    title: "Partie CQB",
    date: "25/04/2025",
    location: "Paris",
    department: "75",
    type: "cqb",
    country: "france",
    lat: 48.8566,
    lng: 2.3522
  }, {
    id: 2,
    title: "Milsim Forest",
    date: "02/05/2025",
    location: "Lyon",
    department: "69",
    type: "milsim",
    country: "france",
    lat: 45.7640,
    lng: 4.8357
  }, {
    id: 3,
    title: "Partie nocturne",
    date: "15/05/2025",
    location: "Marseille",
    department: "13",
    type: "woodland",
    country: "france",
    lat: 43.2965,
    lng: 5.3698
  }, {
    id: 4,
    title: "Open day",
    date: "22/05/2025",
    location: "Bordeaux",
    department: "33",
    type: "woodland",
    country: "france",
    lat: 44.8378,
    lng: -0.5792
  }, {
    id: 5,
    title: "Tournoi 3v3",
    date: "30/05/2025",
    location: "Lille",
    department: "59",
    type: "tournament",
    country: "france",
    lat: 50.6292,
    lng: 3.0573
  }]);

  // Filtrer les événements en fonction des critères de recherche
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || event.type === selectedType;
    const matchesDepartment = selectedDepartment === 'all' || event.department === selectedDepartment;
    const matchesDate = !selectedDate || event.date.includes(selectedDate);
    const matchesCountry = selectedCountry === 'all' || event.country === selectedCountry;
    
    // If search radius is 0, show all events filtered by other criteria
    if (searchRadius[0] === 0) {
      return matchesSearch && matchesType && matchesDepartment && matchesDate && matchesCountry;
    }
    
    // Filter by distance if we have a search center and radius > 0
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

  // Function to geocode a location name to coordinates
  const geocodeLocation = async (locationName) => {
    if (!locationName) return null;
    
    try {
      // Using OpenStreetMap Nominatim API for geocoding
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Use the first result
        const { lat, lon } = data[0];
        return [parseFloat(lon), parseFloat(lat)];
      }
      return null;
    } catch (error) {
      console.error("Error geocoding location:", error);
      return null;
    }
  };

  // Fonction pour obtenir la position actuelle
  const getCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setSearchCenter([longitude, latitude]);
      }, (error) => {
        console.error("Erreur de géolocalisation:", error);
        alert("Impossible d'obtenir votre position actuelle. Veuillez vérifier vos paramètres de localisation.");
      });
    } else {
      alert("La géolocalisation n'est pas prise en charge par votre navigateur.");
    }
  };

  // Handle country selection change
  useEffect(() => {
    if (selectedCountry !== 'all' && countryCoordinates[selectedCountry]) {
      setSearchCenter(countryCoordinates[selectedCountry]);
    }
  }, [selectedCountry]);

  // Handle search query changes
  useEffect(() => {
    const searchLocation = async () => {
      if (searchQuery) {
        const coords = await geocodeLocation(searchQuery);
        if (coords) {
          setSearchCenter(coords);
        }
      }
    };
    
    // Debounce search to avoid too many requests
    const timerId = setTimeout(() => {
      searchLocation();
    }, 500);
    
    return () => clearTimeout(timerId);
  }, [searchQuery]);
  
  return (
    <div className="py-12 md:py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Trouvez votre prochaine partie</h2>
        
        <div className="bg-white rounded-lg overflow-hidden shadow-xl mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-1/4 bg-gray-800 p-4 text-white">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input placeholder="Rechercher..." className="pl-10 bg-gray-700 border-none text-white placeholder:text-gray-400" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-6">
                <Button variant="outline" className="border-gray-600 bg-airsoft-red hover:bg-red-700 text-white w-full">
                  <span className="mx-auto">Dominicale</span>
                </Button>
                <Button variant="outline" className="border-gray-600 bg-airsoft-red hover:bg-red-700 text-white w-full">
                  <span className="mx-auto">Opé</span>
                </Button>
              </div>
              
              <MapFilters 
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
                selectedDepartment={selectedDepartment}
                setSelectedDepartment={setSelectedDepartment}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                searchRadius={searchRadius}
                setSearchRadius={setSearchRadius}
                getCurrentPosition={getCurrentPosition}
              />

              <div className="pt-4">
                <p className="text-sm mb-2">{filteredEvents.length} parties trouvées</p>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && <Badge className="bg-airsoft-red hover:bg-red-700" onClick={() => setSearchQuery('')}>
                      {searchQuery} ×
                    </Badge>}
                  {selectedType !== 'all' && <Badge className="bg-airsoft-red hover:bg-red-700" onClick={() => setSelectedType('all')}>
                      {selectedType} ×
                    </Badge>}
                  {selectedDepartment !== 'all' && <Badge className="bg-airsoft-red hover:bg-red-700" onClick={() => setSelectedDepartment('all')}>
                      Dép. {selectedDepartment} ×
                    </Badge>}
                  {selectedCountry !== 'all' && selectedCountry !== 'france' && <Badge className="bg-airsoft-red hover:bg-red-700" onClick={() => setSelectedCountry('all')}>
                      {selectedCountry} ×
                    </Badge>}
                  {selectedDate && <Badge className="bg-airsoft-red hover:bg-red-700" onClick={() => setSelectedDate('')}>
                      {selectedDate} ×
                    </Badge>}
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-3/4 h-full relative" style={{ height: "600px" }}>
              <MapComponent 
                searchCenter={searchCenter}
                searchRadius={searchRadius[0]} 
                filteredEvents={filteredEvents}
              />
            </div>
          </div>
        </div>
        
        {/* Liste des événements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapSection;
