
import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
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

  // Memoize features to prevent unnecessary recalculations
  const allFeatures = useMemo(() => {
    console.log(`MapComponent: Calculating features...`);
    
    const eventFeatures = createEventFeatures(filteredEvents);
    const storeFeatures = createStoreFeatures(stores);
    const radiusFeature = createSearchRadiusFeature(searchCenter, searchRadius);
    
    const features = [
      ...eventFeatures,
      ...storeFeatures,
      ...(radiusFeature ? [radiusFeature] : [])
    ];

    console.log(`MapComponent: Created ${features.length} features total (${eventFeatures.length} event features, ${storeFeatures.length} store features, ${radiusFeature ? 1 : 0} radius feature)`);
    
    return features;
  }, [filteredEvents, stores, searchCenter, searchRadius]);

  // Initialize click handlers - use useCallback to prevent recreation
  const { setupClickHandler } = useMapClickHandler({
    map: mapInstance,
    overlayRef: overlayInstance,
    setSelectedEvent,
    setSelectedStore
  });

  // Memoize callbacks to prevent map reinitialization
  const handleMapReady = useCallback((mapObj: any, overlay: any, viewObj: any) => {
    console.log(`MapComponent: Map is ready`);
    mapInstance.current = mapObj;
    overlayInstance.current = overlay;
    viewInstance.current = viewObj;
    setupClickHandler();
  }, [setupClickHandler]);

  const handleMapLoaded = useCallback(() => {
    console.log(`MapComponent: Map has loaded`);
    setMapLoaded(true);
  }, []);

  // Initialize map renderer
  const { map, overlayRef } = useMapRenderer({
    mapRef,
    popupRef,
    searchCenter,
    features: allFeatures,
    onMapReady: handleMapReady,
    onMapLoaded: handleMapLoaded
  });

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
