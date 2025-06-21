
import { useRef, useEffect, useCallback } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay';

interface MapRendererProps {
  mapRef: React.RefObject<HTMLDivElement>;
  popupRef: React.RefObject<HTMLDivElement>;
  searchCenter: [number, number];
  features: Feature[];
  onMapReady: (map: Map, overlay: Overlay, view: View) => void;
  onMapLoaded: () => void;
}

export const useMapRenderer = ({
  mapRef,
  popupRef,
  searchCenter,
  features,
  onMapReady,
  onMapLoaded
}: MapRendererProps) => {
  const map = useRef<Map | null>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const view = useRef<View | null>(null);
  const vectorLayer = useRef<VectorLayer<VectorSource> | null>(null);
  const isMapInitialized = useRef(false);
  const userInteracting = useRef(false);
  const lastSearchCenter = useRef<[number, number]>(searchCenter);

  // Initialize map only once
  useEffect(() => {
    if (!mapRef.current || !popupRef.current || isMapInitialized.current) return;

    console.log(`MapRenderer: Initializing map for the first time`);

    // Create popup overlay
    overlayRef.current = new Overlay({
      element: popupRef.current,
      autoPan: {
        animation: {
          duration: 250
        }
      }
    });

    // Create vector source and layer
    const vectorSource = new VectorSource();
    vectorLayer.current = new VectorLayer({
      source: vectorSource
    });

    const newView = new View({
      center: fromLonLat(searchCenter),
      zoom: 6
    });

    view.current = newView;

    // Initialize map
    map.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer.current
      ],
      view: newView
    });

    map.current.addOverlay(overlayRef.current);

    // Track user interactions to prevent automatic recentering
    map.current.on('pointerdrag', () => {
      userInteracting.current = true;
    });

    map.current.on('movestart', () => {
      userInteracting.current = true;
    });

    map.current.on('moveend', () => {
      // Reset user interaction after a delay
      setTimeout(() => {
        userInteracting.current = false;
      }, 1000);
    });

    // Notify parent component that map is ready
    onMapReady(map.current, overlayRef.current, newView);

    // Set map as loaded when rendered
    map.current.once('rendercomplete', () => {
      onMapLoaded();
    });

    isMapInitialized.current = true;
    lastSearchCenter.current = searchCenter;

    return () => {
      if (map.current) {
        map.current.setTarget(undefined);
        map.current = null;
        isMapInitialized.current = false;
      }
    };
  }, [mapRef, popupRef]);

  // Update features without recreating the map
  useEffect(() => {
    if (!vectorLayer.current || !isMapInitialized.current) {
      console.log(`MapRenderer: Cannot update features - vectorLayer or map not ready`);
      return;
    }

    console.log(`MapRenderer: Updating features - ${features.length} total`);
    
    const vectorSource = vectorLayer.current.getSource();
    if (vectorSource) {
      vectorSource.clear();
      if (features.length > 0) {
        vectorSource.addFeatures(features);
        console.log(`MapRenderer: Added ${features.length} features to map`);
        
        // Force a refresh of the map after adding features
        setTimeout(() => {
          if (map.current) {
            map.current.render();
            console.log(`MapRenderer: Forced map refresh`);
          }
        }, 100);
      } else {
        console.log(`MapRenderer: No features to add`);
      }
    } else {
      console.error(`MapRenderer: Vector source is null`);
    }
  }, [features]);

  // Update view center only when search center changes significantly and user is not interacting
  useEffect(() => {
    if (!view.current || !isMapInitialized.current) return;

    // Calculate distance between old and new center
    const [oldLng, oldLat] = lastSearchCenter.current;
    const [newLng, newLat] = searchCenter;
    const distance = Math.sqrt(Math.pow(newLng - oldLng, 2) + Math.pow(newLat - oldLat, 2));

    // Only recenter if the change is significant (> 0.1 degrees) and user is not interacting
    if (distance > 0.1 && !userInteracting.current) {
      console.log(`MapRenderer: Updating view center to ${searchCenter} (distance: ${distance.toFixed(3)})`);
      view.current.animate({
        center: fromLonLat(searchCenter),
        duration: 1000
      });
      lastSearchCenter.current = searchCenter;
    } else if (distance > 0.1) {
      console.log(`MapRenderer: Skipping center update - user is interacting (distance: ${distance.toFixed(3)})`);
    }
  }, [searchCenter]);

  return {
    map,
    overlayRef,
    view: view.current
  };
};
