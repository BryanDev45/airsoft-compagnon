
import React, { useState, useRef, useEffect } from 'react';
import { Search, Calendar, Map as MapIcon, MapPin, Maximize, Navigation } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Slider } from "@/components/ui/slider";
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Circle from 'ol/geom/Circle';
import { Style, Icon, Fill, Stroke } from 'ol/style';
import Overlay from 'ol/Overlay';
import { transform } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';

// Helper functions - define before they are used
const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
};

const MapSection = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const searchCircleLayer = useRef(null);
  const markersLayer = useRef(null);
  const popupOverlay = useRef(null);
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
        
        if (map.current) {
          map.current.getView().animate({
            center: fromLonLat([longitude, latitude]),
            zoom: 12,
            duration: 1000
          });
          
          // Update search circle
          updateSearchCircle([longitude, latitude], searchRadius[0]);
        }
      }, (error) => {
        console.error("Erreur de géolocalisation:", error);
        alert("Impossible d'obtenir votre position actuelle. Veuillez vérifier vos paramètres de localisation.");
      });
    } else {
      alert("La géolocalisation n'est pas prise en charge par votre navigateur.");
    }
  };

  // Function to update the search circle on the map
  const updateSearchCircle = (center, radiusKm) => {
    if (!map.current) return;
    
    // Remove any existing search circle layer
    if (searchCircleLayer.current) {
      map.current.removeLayer(searchCircleLayer.current);
      searchCircleLayer.current = null;
    }
    
    // If radius is 0, don't show the circle
    if (radiusKm === 0) return;
    
    // Calculate radius in meters (OL uses meters)
    const radiusMeters = radiusKm * 1000;
    
    // Create center point in EPSG:3857 (Web Mercator)
    const centerPoint = fromLonLat(center);
    
    // Create a circle feature with proper radius
    const circle = new Circle(centerPoint, radiusMeters);
    const circleFeature = new Feature(circle);
    
    // Create vector source with the circle feature
    const vectorSource = new VectorSource({
      features: [circleFeature]
    });
    
    // Create vector layer with style
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(234, 56, 76, 0.8)',
          width: 2
        }),
        fill: new Fill({
          color: 'rgba(234, 56, 76, 0.1)'
        })
      }),
      zIndex: 1 // Lower zIndex so markers appear above
    });
    
    // Add to map
    map.current.addLayer(vectorLayer);
    searchCircleLayer.current = vectorLayer;

    // Update the markers layer to ensure it's on top
    if (markersLayer.current) {
      markersLayer.current.setZIndex(2);
    }
  };

  // Handle country selection change
  useEffect(() => {
    if (selectedCountry !== 'all' && countryCoordinates[selectedCountry]) {
      setSearchCenter(countryCoordinates[selectedCountry]);
      
      if (map.current) {
        // Center map on selected country
        map.current.getView().animate({
          center: fromLonLat(countryCoordinates[selectedCountry]),
          zoom: 6,
          duration: 1000
        });
        
        // Update search circle if radius > 0
        if (searchRadius[0] > 0) {
          updateSearchCircle(countryCoordinates[selectedCountry], searchRadius[0]);
        }
      }
    }
  }, [selectedCountry]);

  // Handle search query changes
  useEffect(() => {
    const searchLocation = async () => {
      if (searchQuery) {
        const coords = await geocodeLocation(searchQuery);
        if (coords) {
          setSearchCenter(coords);
          if (map.current) {
            map.current.getView().animate({
              center: fromLonLat(coords),
              zoom: 12,
              duration: 1000
            });
            
            // Update search circle
            if (searchRadius[0] > 0) {
              updateSearchCircle(coords, searchRadius[0]);
            }
          }
        }
      }
    };
    
    // Debounce search to avoid too many requests
    const timerId = setTimeout(() => {
      searchLocation();
    }, 500);
    
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  // Update search circle when radius changes
  useEffect(() => {
    if (searchCenter) {
      if (searchRadius[0] > 0) {
        updateSearchCircle(searchCenter, searchRadius[0]);
      } else {
        // If radius is 0, remove the circle
        if (searchCircleLayer.current && map.current) {
          map.current.removeLayer(searchCircleLayer.current);
          searchCircleLayer.current = null;
        }
      }
    }
  }, [searchRadius]);

  // Update markers on the map
  const updateMarkers = () => {
    if (!map.current) return;
    
    // Remove existing markers layer if it exists
    if (markersLayer.current) {
      map.current.removeLayer(markersLayer.current);
      markersLayer.current = null;
    }
    
    // Create a new vector source for markers
    const vectorSource = new VectorSource();
    
    // Add markers for filtered events
    filteredEvents.forEach(event => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([event.lng, event.lat])),
        name: event.title,
        location: event.location,
        date: event.date,
        type: event.type,
        department: event.department,
        id: event.id
      });
      
      vectorSource.addFeature(feature);
    });
    
    // Create a new vector layer with the markers
    const newMarkersLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/geo-alt-fill.svg',
          scale: 1.5,
          color: '#ea384c'
        })
      }),
      zIndex: 2 // Higher zIndex to ensure markers are on top
    });
    
    // Add the new markers layer to the map
    map.current.addLayer(newMarkersLayer);
    markersLayer.current = newMarkersLayer;
  };

  // Initialize the map OpenLayers
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Create popup overlay for marker info
    const container = document.createElement('div');
    container.className = 'ol-popup bg-white p-4 rounded-lg shadow-xl text-sm max-w-xs';
    const overlay = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    } as any);
    popupOverlay.current = overlay;

    // Create the map
    map.current = new Map({
      target: mapContainer.current,
      layers: [new TileLayer({
        source: new OSM()
      })],
      view: new View({
        center: fromLonLat(searchCenter),
        zoom: 5
      }),
      controls: []
    });

    // Add the popup overlay to the map
    map.current.addOverlay(overlay);

    // Create initial search radius circle if needed
    if (searchRadius[0] > 0) {
      updateSearchCircle(searchCenter, searchRadius[0]);
    }
    
    // Add initial markers
    updateMarkers();

    // Add click event handler for markers
    map.current.on('click', function (evt) {
      const feature = map.current.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
      });
      
      if (feature) {
        const geometry = feature.getGeometry();
        const coordinate = geometry.getCoordinates();
        
        const eventId = feature.get('id');
        const eventType = feature.get('type');
        
        container.innerHTML = `
          <div class="font-semibold text-lg text-airsoft-red mb-2">${feature.get('name')}</div>
          <div class="mb-1"><span class="font-medium">Lieu:</span> ${feature.get('location')}</div>
          <div class="mb-1"><span class="font-medium">Date:</span> ${feature.get('date')}</div>
          <div class="mb-1"><span class="font-medium">Type:</span> ${eventType === 'cqb' ? 'CQB' : 
            eventType === 'milsim' ? 'Milsim' : 
            eventType === 'woodland' ? 'Woodland' : 
            eventType === 'speedsoft' ? 'Speedsoft' : 
            eventType === 'tournament' ? 'Tournoi' : eventType}</div>
          <div class="mb-3"><span class="font-medium">Département:</span> ${feature.get('department')}</div>
          <a href="/game/${eventId}" class="bg-airsoft-red text-white px-3 py-1 rounded text-sm inline-block hover:bg-red-700">
            Plus d'informations
          </a>
        `;
        
        overlay.setPosition(coordinate);
      } else {
        overlay.setPosition(undefined);
      }
    });

    // Change cursor when hovering over markers
    map.current.on('pointermove', function (e) {
      const pixel = map.current.getEventPixel(e.originalEvent);
      const hit = map.current.hasFeatureAtPixel(pixel);
      map.current.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.setTarget(null);
        map.current = null;
      }
    };
  }, []);

  // Update markers when filters change
  useEffect(() => {
    updateMarkers();
  }, [filteredEvents]);
  
  return <div className="py-12 md:py-16 bg-gray-100">
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
                <Button variant="outline" className="border-gray-600 bg-airsoft-red hover:bg-red-700 text-white w-full text-center">
                  <span className="mx-auto">Dominicale</span>
                </Button>
                <Button variant="outline" className="border-gray-600 bg-airsoft-red hover:bg-red-700 text-white w-full text-center">
                  <span className="mx-auto">Opé</span>
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Pays</label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Tous les pays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les pays</SelectItem>
                      <SelectItem value="france">France</SelectItem>
                      <SelectItem value="belgique">Belgique</SelectItem>
                      <SelectItem value="suisse">Suisse</SelectItem>
                      <SelectItem value="allemagne">Allemagne</SelectItem>
                      <SelectItem value="espagne">Espagne</SelectItem>
                      <SelectItem value="italie">Italie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
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
                    <Input type="date" className="pl-10 bg-gray-700 border-gray-600 text-white" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Rayon de recherche: {searchRadius[0]} km {searchRadius[0] === 0 && "(Toutes les parties)"}</label>
                  <Slider
                    defaultValue={[50]}
                    max={200}
                    min={0}
                    step={10}
                    className="pt-2"
                    value={searchRadius}
                    onValueChange={setSearchRadius}
                  />
                </div>
                
                <div>
                  <Button onClick={getCurrentPosition} className="w-full bg-airsoft-red hover:bg-red-700 text-white flex items-center justify-center gap-2">
                    <Navigation size={16} />
                    Ma position
                  </Button>
                </div>

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
            </div>
            
            <div className="w-full md:w-3/4 h-full relative">
              <div ref={mapContainer} className="w-full h-[600px] md:h-full bg-gray-300">
                {!map.current && <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <MapIcon size={48} className="text-gray-400 mb-2" />
                    <p className="text-center text-gray-500">
                      Chargement de la carte...
                    </p>
                  </div>}
              </div>
            </div>
          </div>
        </div>
        
        {/* Liste des événements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {filteredEvents.map(event => (
            <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 clip-card">
              <div className="h-40 bg-gray-200 relative overflow-hidden">
                <img src="/lovable-uploads/c242d3b0-8906-4f00-9b3b-fc251f703e4b.png" alt={event.title} className="w-full h-full object-cover" />
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
                    {event.type === 'cqb' ? 'CQB' : event.type === 'milsim' ? 'Milsim' : event.type === 'woodland' ? 'Woodland' : event.type === 'speedsoft' ? 'Speedsoft' : event.type === 'tournament' ? 'Tournoi' : event.type}
                  </Badge>
                  <Badge variant="outline">
                    Dép. {event.department}
                  </Badge>
                </div>
                <Link to={`/game/${event.id}`}>
                  <Button className="w-full mt-4 bg-airsoft-red hover:bg-red-700">
                    Plus d'informations
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>;
};

export default MapSection;
