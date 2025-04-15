
import React, { useState } from 'react';
import { Search, Calendar, Map, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from 'react-router-dom';

const MapSection = () => {
  const [mapApiKey, setMapApiKey] = useState('');
  const [showMapKeyInput, setShowMapKeyInput] = useState(true);

  // Simulons des données de parties d'airsoft
  const [events] = useState([
    { id: 1, title: "Partie CQB", date: "25/04/2025", location: "Paris", lat: 48.8566, lng: 2.3522 },
    { id: 2, title: "Milsim Forest", date: "02/05/2025", location: "Lyon", lat: 45.7640, lng: 4.8357 },
    { id: 3, title: "Partie nocturne", date: "15/05/2025", location: "Marseille", lat: 43.2965, lng: 5.3698 },
    { id: 4, title: "Open day", date: "22/05/2025", location: "Bordeaux", lat: 44.8378, lng: -0.5792 },
    { id: 5, title: "Tournoi 3v3", date: "30/05/2025", location: "Lille", lat: 50.6292, lng: 3.0573 },
  ]);

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
                    <Select>
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
                    <Select>
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
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-3/4 h-[400px] md:h-[600px] relative bg-gray-300 flex items-center justify-center">
                <Map size={48} className="text-gray-400" />
                <p className="absolute text-center">
                  Ici s'afficherait la carte avec les marqueurs<br />
                  en utilisant l'API Mapbox
                </p>
                
                {/* Simulation des marqueurs de la carte */}
                <div className="absolute inset-0 p-4 pointer-events-none">
                  {events.map((event) => (
                    <div 
                      key={event.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${(event.lng + 5) / 15 * 100}%`,
                        top: `${(55 - event.lat) / 15 * 100}%`,
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <MapPin size={24} className="text-airsoft-red" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Liste des événements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {events.map((event) => (
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
