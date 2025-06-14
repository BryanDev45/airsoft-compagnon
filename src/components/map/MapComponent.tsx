
import React, { useRef, useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, transform } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Circle from 'ol/geom/Circle';
import Overlay from 'ol/Overlay';
import MapMarker from './MapMarker';
import StoreImageCarousel from '../stores/StoreImageCarousel';
import { MapEvent, MapStore } from '@/hooks/useMapData';
import { areCoordinatesValid } from '@/utils/geocodingUtils';

interface MapComponentProps {
  searchCenter: [number, number];
  searchRadius: number;
  filteredEvents: MapEvent[];
  stores?: MapStore[];
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  searchCenter, 
  searchRadius, 
  filteredEvents, 
  stores = [] 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const [view, setView] = useState<View | null>(null);

  useEffect(() => {
    if (!mapRef.current || !popupRef.current) return;

    console.log(`MapComponent: Rendering map with ${filteredEvents.length} events and ${stores.length} stores`);

    // Create popup overlay
    overlayRef.current = new Overlay({
      element: popupRef.current,
      autoPan: {
        animation: {
          duration: 250
        }
      }
    });

    const features = [];

    // Create event markers - Vérifier et filtrer les coordonnées valides
    filteredEvents.forEach(event => {
      // S'assurer que les coordonnées sont des nombres valides
      const lat = Number(event.lat);
      const lng = Number(event.lng);
      
      console.log(`MapComponent: Processing event "${event.title}" with coordinates (${lat}, ${lng})`);
      
      // Vérifier que les coordonnées sont valides
      if (!areCoordinatesValid(lat, lng)) {
        console.warn(`MapComponent: Skipping event "${event.title}" with invalid coordinates: (${lat}, ${lng})`);
        return;
      }

      console.log(`MapComponent: Adding marker for event "${event.title}" at coordinates (${lat}, ${lng})`);
      
      try {
        const feature = new Feature({
          geometry: new Point(fromLonLat([lng, lat])),
          event: event,
          type: 'event'
        });

        feature.setStyle(new Style({
          image: new CircleStyle({
            radius: 10,
            fill: new Fill({
              color: '#ea384c'
            }),
            stroke: new Stroke({
              color: '#ffffff',
              width: 3
            })
          })
        }));

        features.push(feature);
        console.log(`MapComponent: Successfully added marker for event "${event.title}"`);
      } catch (error) {
        console.error(`MapComponent: Error creating marker for event "${event.title}":`, error);
      }
    });

    // Create store markers - Vérifier et filtrer les coordonnées valides
    stores.forEach(store => {
      const lat = parseFloat(String(store.lat)) || 0;
      const lng = parseFloat(String(store.lng)) || 0;
      
      // Vérifier que les coordonnées sont valides avant de créer le marqueur
      if (!areCoordinatesValid(lat, lng)) {
        console.warn(`Skipping store "${store.name}" with invalid coordinates: (${lat}, ${lng})`);
        return;
      }

      console.log(`Adding store marker for "${store.name}" at (${lat}, ${lng})`);
      
      const feature = new Feature({
        geometry: new Point(fromLonLat([lng, lat])),
        store: store,
        type: 'store'
      });

      feature.setStyle(new Style({
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({
            color: '#10b981'
          }),
          stroke: new Stroke({
            color: '#ffffff',
            width: 3
          })
        })
      }));

      features.push(feature);
    });

    // Create search radius circle
    if (searchRadius > 0) {
      const radiusFeature = new Feature({
        geometry: new Circle(fromLonLat(searchCenter), searchRadius * 1000)
      });

      radiusFeature.setStyle(
        new Style({
          stroke: new Stroke({
            color: 'rgba(234, 56, 76, 0.8)',
            width: 2
          }),
          fill: new Fill({
            color: 'rgba(234, 56, 76, 0.1)'
          })
        })
      );

      features.push(radiusFeature);
    }

    console.log(`MapComponent: Created ${features.length} features total (${filteredEvents.filter(e => areCoordinatesValid(Number(e.lat), Number(e.lng))).length} event markers)`);

    const vectorSource = new VectorSource({
      features: features
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    const newView = new View({
      center: fromLonLat(searchCenter),
      zoom: 6
    });

    setView(newView);

    // Initialize map
    map.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: newView
    });

    map.current.addOverlay(overlayRef.current);

    // Click handler for markers
    map.current.on('click', (event) => {
      const feature = map.current?.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      
      if (feature) {
        const coordinates = (feature.getGeometry() as Point).getCoordinates();
        
        if (feature.get('event')) {
          const event = feature.get('event');
          setSelectedEvent(event);
          setSelectedStore(null);
          overlayRef.current?.setPosition(coordinates);
        } else if (feature.get('store')) {
          const store = feature.get('store');
          setSelectedStore(store);
          setSelectedEvent(null);
          overlayRef.current?.setPosition(coordinates);
        }
      } else {
        setSelectedEvent(null);
        setSelectedStore(null);
        overlayRef.current?.setPosition(undefined);
      }
    });

    // Set map as loaded when rendered
    map.current.once('rendercomplete', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.setTarget(undefined);
      map.current = null;
    };
  }, [searchCenter, searchRadius, filteredEvents, stores]);

  // Update view when center changes
  useEffect(() => {
    if (view && map.current) {
      view.animate({
        center: fromLonLat(searchCenter),
        duration: 1000,
        zoom: searchRadius > 0 ? 12 : 6
      });
    }
  }, [searchCenter, searchRadius, view]);

  return (
    <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden relative">
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center flex-col bg-gray-200 z-10">
          <MapPin size={24} className="text-gray-400 mb-2" />
          <p className="text-center text-gray-500">Chargement de la carte...</p>
        </div>
      )}
      <div ref={popupRef} className="absolute z-50">
        {selectedEvent && (
          <MapMarker 
            event={selectedEvent} 
            onClose={() => {
              setSelectedEvent(null);
              overlayRef.current?.setPosition(undefined);
            }}
          />
        )}
        {selectedStore && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-[400px] border border-gray-200">
            {/* Image carousel pour le magasin */}
            <div className="relative h-40">
              <StoreImageCarousel 
                images={[
                  selectedStore.image,
                  selectedStore.picture2,
                  selectedStore.picture3,
                  selectedStore.picture4,
                  selectedStore.picture5
                ].filter(Boolean)}
                storeName={selectedStore.name}
              />
            </div>
            
            {/* Contenu du magasin */}
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg text-gray-900 pr-2">{selectedStore.name}</h3>
                <button 
                  onClick={() => {
                    setSelectedStore(null);
                    overlayRef.current?.setPosition(undefined);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none flex-shrink-0"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600 flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
                  <span className="break-words">{selectedStore.address}, {selectedStore.zip_code} {selectedStore.city}</span>
                </p>
                
                {selectedStore.phone && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-gray-400">📞</span>
                    <span>{selectedStore.phone}</span>
                  </p>
                )}
                
                {selectedStore.email && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-gray-400">✉️</span>
                    <span className="break-all">{selectedStore.email}</span>
                  </p>
                )}
                
                {selectedStore.website && (
                  <a 
                    href={selectedStore.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline inline-flex items-center gap-2"
                  >
                    <span className="text-gray-400">🌐</span>
                    <span>Site web</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
