
import React, { useState, useRef, useEffect } from 'react';
import { Search, Calendar, Map as MapIcon, MapPin, Maximize, Navigation, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Slider } from "@/components/ui/slider";
import MapComponent from './components/map/MapComponent';
import EventCard from './components/map/EventCard';
import MapFilters from './components/map/MapFilters';
import { calculateDistance } from './utils/mapUtils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const MapSection = () => {
  const { toast } = useToast();
  const mapContainer = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('france');
  const [searchRadius, setSearchRadius] = useState([0]);
  const [searchCenter, setSearchCenter] = useState<[number, number]>([2.3522, 46.2276]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);

  const countryCoordinates: Record<string, [number, number]> = {
    france: [2.3522, 46.2276],
    belgique: [4.3517, 50.8503],
    suisse: [8.2275, 46.8182],
    allemagne: [10.4515, 51.1657],
    espagne: [-3.7492, 40.4637],
    italie: [12.5674, 41.8719]
  };

  // Charger les parties d'airsoft depuis Supabase
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('airsoft_games')
          .select(`
            id, 
            title, 
            date, 
            address, 
            city, 
            zip_code, 
            game_type,
            max_players,
            price,
            latitude,
            longitude,
            created_at,
            created_by
          `)
          .order('date', { ascending: true });
        
        if (error) {
          throw error;
        }

        // Transformation des données pour correspondre au format attendu par les composants existants
        const formattedEvents = data?.map(game => ({
          id: game.id,
          title: game.title,
          date: new Date(game.date).toLocaleDateString('fr-FR'),
          location: game.city,
          department: game.zip_code?.substring(0, 2) || "",
          type: game.game_type || "woodland",
          country: "france", // Valeur par défaut, peut être étendue plus tard
          lat: game.latitude ? parseFloat(String(game.latitude)) : 48.8566,
          lng: game.longitude ? parseFloat(String(game.longitude)) : 2.3522,
          maxPlayers: game.max_players,
          price: game.price,
          image: "/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png" // Image par défaut
        })) || [];
        
        setEvents(formattedEvents);
      } catch (error: any) {
        console.error("Erreur lors du chargement des parties:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les parties",
          variant: "destructive" 
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchGames();
  }, [toast]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || event.type === selectedType;
    const matchesDepartment = selectedDepartment === 'all' || event.department === selectedDepartment;
    const matchesDate = !selectedDate || event.date.includes(selectedDate);
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

  const geocodeLocation = async (locationName: string) => {
    if (!locationName) return null;
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        return [parseFloat(lon), parseFloat(lat)] as [number, number];
      }
      return null;
    } catch (error) {
      console.error("Error geocoding location:", error);
      return null;
    }
  };

  const getCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setSearchCenter([longitude, latitude]);
      }, (error) => {
        console.error("Erreur de géolocalisation:", error);
        toast({
          title: "Erreur de localisation",
          description: "Impossible d'obtenir votre position actuelle. Veuillez vérifier vos paramètres de localisation.",
          variant: "destructive"
        });
      });
    } else {
      toast({
        title: "Non supporté",
        description: "La géolocalisation n'est pas prise en charge par votre navigateur.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (selectedCountry !== 'all' && countryCoordinates[selectedCountry]) {
      setSearchCenter(countryCoordinates[selectedCountry]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    const searchLocation = async () => {
      if (searchQuery) {
        const coords = await geocodeLocation(searchQuery);
        if (coords) {
          setSearchCenter(coords);
        }
      }
    };
    
    const timerId = setTimeout(() => {
      searchLocation();
    }, 500);
    
    return () => clearTimeout(timerId);
  }, [searchQuery]);
  
  return (
    <div className="py-12 md:py-0">
      <div className="max-w-7xl mx-auto px-4 py-[30px]">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
            <span className="relative z-10">Trouvez votre prochaine partie</span>
            <span className="absolute bottom-0 left-0 w-full h-2 bg-airsoft-red/20 -z-0"></span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
            Des centaines de parties d'airsoft près de chez vous
          </p>
        </div>
        
        <div className="flex justify-end mb-6">
          <Link to="/parties/create">
            <Button className="bg-airsoft-red hover:bg-red-700 shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              Créer une partie
            </Button>
          </Link>
        </div>
        
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
                selectedDate={selectedDate} 
                setSelectedDate={setSelectedDate} 
                searchRadius={searchRadius} 
                setSearchRadius={setSearchRadius} 
                getCurrentPosition={getCurrentPosition}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
              />

              <div className="pt-4">
                <p className="text-sm mb-2">
                  {loading ? 'Chargement des parties...' : `${filteredEvents.length} parties trouvées`}
                </p>
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
            
            <div className="w-full md:w-3/4 h-[600px] relative">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="h-12 w-12 border-4 border-airsoft-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Chargement de la carte...</p>
                  </div>
                </div>
              ) : (
                <MapComponent searchCenter={searchCenter} searchRadius={searchRadius[0]} filteredEvents={filteredEvents} />
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {loading ? (
            Array.from({length: 3}).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500 text-xl">Aucune partie trouvée correspondant à vos critères</p>
              <p className="text-gray-400 mt-2">Essayez de modifier vos filtres ou <Link to="/parties/create" className="text-airsoft-red hover:underline">créez votre propre partie</Link></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapSection;
