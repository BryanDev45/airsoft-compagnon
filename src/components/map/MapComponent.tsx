
import React, { useRef, useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { fromLonLat } from 'ol/proj';
import { MapEvent, MapStore } from '@/hooks/useGamesData';
import { areCoordinatesValid } from '@/utils/geocodingUtils';
import { useMapRenderer } from './MapRenderer';
import { useMapClickHandler } from './MapEventHandlers';
import { createEventFeatures, createStoreFeatures, createSearchRadiusFeature } from './MapFeatures';
import MapPopup from './MapPopup';

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
  const popupRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MapEvent | null>(null);
  const [selectedStore, setSelectedStore] = useState<MapStore | null>(null);
  const mapInstance = useRef<any>(null);
  const overlayInstance = useRef<any>(null);
  const viewInstance = useRef<any>(null);

  console.log(`MapComponent: Rendering map with ${filteredEvents.length} events and ${stores.length} stores`);

  // Create all features
  const eventFeatures = createEventFeatures(filteredEvents);
  const storeFeatures = createStoreFeatures(stores);
  const radiusFeature = createSearchRadiusFeature(searchCenter, searchRadius);
  
  const allFeatures = [
    ...eventFeatures,
    ...storeFeatures,
    ...(radiusFeature ? [radiusFeature] : [])
  ];

  console.log(`MapComponent: Created ${allFeatures.length} features total (${eventFeatures.length} event markers)`);

  // Initialize click handlers
  const { setupClickHandler } = useMapClickHandler({
    map: mapInstance,
    overlayRef: overlayInstance,
    setSelectedEvent,
    setSelectedStore
  });

  // Initialize map renderer
  const { map, overlayRef, view } = useMapRenderer({
    mapRef,
    popupRef,
    searchCenter,
    features: allFeatures,
    onMapReady: (mapObj, overlay, viewObj) => {
      mapInstance.current = mapObj;
      overlayInstance.current = overlay;
      viewInstance.current = viewObj;
      setupClickHandler();
    },
    onMapLoaded: () => setMapLoaded(true)
  });

  // Update view when center changes
  useEffect(() => {
    if (viewInstance.current && mapInstance.current) {
      viewInstance.current.animate({
        center: fromLonLat(searchCenter),
        duration: 1000,
        zoom: searchRadius > 0 ? 12 : 6
      });
    }
  }, [searchCenter, searchRadius]);

  const handleClosePopup = () => {
    setSelectedEvent(null);
    setSelectedStore(null);
    overlayInstance.current?.setPosition(undefined);
  };

  return (
    <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden relative">
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center flex-col bg-gray-200 z-10">
          <MapPin size={24} className="text-gray-400 mb-2" />
          <p className="text-center text-gray-500">Chargement de la carte...</p>
        </div>
      )}
      <div ref={popupRef} className="absolute z-50">
        <MapPopup
          selectedEvent={selectedEvent}
          selectedStore={selectedStore}
          onClose={handleClosePopup}
        />
      </div>
    </div>
  );
};

export default MapComponent;
