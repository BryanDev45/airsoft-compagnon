
import React, { useState, useRef, useEffect } from 'react';
import { Search, Calendar, Map as MapIcon, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Badge } from '@/components/ui/badge';

const MapSection = () => {
  const [mapApiKey, setMapApiKey] = useState('');
  const [showMapKeyInput, setShowMapKeyInput] = useState(true);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  
  // Simulons des données de parties d'airsoft
  const [events] = useState([
    { id: 1, title: "Partie CQB", date: "25/04/2025", location: "Paris", department: "75", type: "cqb", lat: 48.8566, lng: 2.3522 },
    { id: 2, title: "Milsim Forest", date: "02/05/2025", location: "Lyon", department: "69", type: "milsim", lat: 45.7640, lng: 4.8357 },
    { id: 3, title: "Partie nocturne", date: "15/05/2025", location: "Marseille", department: "13", type: "woodland", lat: 43.2965, lng: 5.3698 },
    { id: 4, title: "Open day", date: "22/05/2025", location: "Bordeaux", department: "33", type: "woodland", lat: 44.8378, lng: -0.5792 },
    { id: 5, title: "Tournoi 3v3", date: "30/05/2025", location: "Lille", department: "59", type: "tournament", lat: 50.6292, lng: 3.0573 },
  ]);

  // Filtrer les événements en fonction des critères de recherche
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || event.type === selectedType;
    const matchesDepartment = selectedDepartment === 'all' || event.department === selectedDepartment;
    const matchesDate = !selectedDate || event.date.includes(selectedDate);
    
    return matchesSearch && matchesType && matchesDepartment && matchesDate;
  });

  // Initialiser la carte Mapbox lorsque l'API key est fournie
  useEffect(() => {
    if (!mapApiKey || showMapKeyInput || !mapContainer.current || map.current) return;
    
    mapboxgl.accessToken = mapApiKey;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [2.3522, 46.2276], // Centre de la France
      zoom: 5
    });

    // Ajouter les contrôles de navigation
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Ajouter les marqueurs pour chaque événement
    filteredEvents.forEach(event => {
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <strong>${event.title}</strong><br>
          ${event.location}<br>
          ${event.date}
        `);

      new mapboxgl.Marker({ color: '#ff0000' })
        .setLngLat([event.lng, event.lat])
        .setPopup(popup)
        .addTo(map.current);
    });

    // Nettoyage
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapApiKey, showMapKeyInput, filteredEvents]);

  return (
    <div className="py-12 md:py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Trouvez votre prochaine partie</h2>
        
        <div className="bg-white rounded-lg overflow-hidden shadow-xl mb-8 border border-gray-200">
          {showMapKeyInput ? (
            <div className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Carte interactive</h3>
              <p className="mb-4">Pour afficher la carte, veuillez entrer votre clé API Mapbox :</p>
              <div className="flex max-w-md mx-auto gap-2">
                <Input
                  value={mapApiKey}
                  onChange={(e) => setMapApiKey(e.target.value)}
                  placeholder="Entrez votre clé API Mapbox"
                  className="flex-grow"
                />
                <Button 
                  onClick={() => setShowMapKeyInput(false)} 
                  className="bg-airsoft-red hover:bg-red-700"
                  disabled={!mapApiKey}
                >
                  Afficher la carte
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Vous pouvez obtenir une clé API gratuite sur <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">mapbox.com</a>
              </p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/4 bg-gray-800 p-4 text-white">
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input 
                      placeholder="Rechercher..." 
                      className="pl-10 bg-gray-700 border-none text-white placeholder:text-gray-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-6">
                  <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700 w-full justify-start">
                    Domicile
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700 w-full justify-start">
                    Ops
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Département</label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Tous" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="75">Paris (75)</SelectItem>
                        <SelectItem value="69">Rhône (69)</SelectItem>
                        <SelectItem value="33">Gironde (33)</SelectItem>
                        <SelectItem value="13">Bouches-du-Rhône (13)</SelectItem>
                        <SelectItem value="59">Nord (59)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Tous les types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        <SelectItem value="cqb">CQB</SelectItem>
                        <SelectItem value="milsim">Milsim</SelectItem>
                        <SelectItem value="woodland">Woodland</SelectItem>
                        <SelectItem value="speedsoft">Speedsoft</SelectItem>
                        <SelectItem value="tournament">Tournoi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input 
                        type="date" 
                        className="pl-10 bg-gray-700 border-gray-600 text-white"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <p className="text-sm mb-2">{filteredEvents.length} parties trouvées</p>
                    <div className="flex flex-wrap gap-2">
                      {searchQuery && (
                        <Badge className="bg-airsoft-red hover:bg-red-700" onClick={() => setSearchQuery('')}>
                          {searchQuery} ×
                        </Badge>
                      )}
                      {selectedType !== 'all' && (
                        <Badge className="bg-airsoft-red hover:bg-red-700" onClick={() => setSelectedType('all')}>
                          {selectedType} ×
                        </Badge>
                      )}
                      {selectedDepartment !== 'all' && (
                        <Badge className="bg-airsoft-red hover:bg-red-700" onClick={() => setSelectedDepartment('all')}>
                          Dép. {selectedDepartment} ×
                        </Badge>
                      )}
                      {selectedDate && (
                        <Badge className="bg-airsoft-red hover:bg-red-700" onClick={() => setSelectedDate('')}>
                          {selectedDate} ×
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div ref={mapContainer} className="w-full md:w-3/4 h-[400px] md:h-[600px] relative bg-gray-300">
                {!map.current && (
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <MapIcon size={48} className="text-gray-400 mb-2" />
                    <p className="text-center text-gray-500">
                      Chargement de la carte...
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Liste des événements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 clip-card">
              <div className="h-40 bg-gray-200 relative overflow-hidden">
                <img 
                  src="/lovable-uploads/c242d3b0-8906-4f00-9b3b-fc251f703e4b.png" 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-xl font-bold text-white">{event.title}</h3>
                  <div className="flex items-center gap-2 text-white">
                    <Calendar size={16} />
                    <span>{event.date}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} />
                  <span>{event.location}</span>
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="mr-2">
                    {event.type === 'cqb' ? 'CQB' : 
                     event.type === 'milsim' ? 'Milsim' : 
                     event.type === 'woodland' ? 'Woodland' : 
                     event.type === 'speedsoft' ? 'Speedsoft' : 
                     event.type === 'tournament' ? 'Tournoi' : 
                     event.type}
                  </Badge>
                  <Badge variant="outline">
                    Dép. {event.department}
                  </Badge>
                </div>
                <Link to={`/game/${event.id}`}>
                  <Button 
                    className="w-full mt-4 bg-airsoft-red hover:bg-red-700"
                  >
                    Plus d'informations
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapSection;
