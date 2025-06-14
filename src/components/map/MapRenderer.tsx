
import { useRef, useEffect } from 'react';
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

  useEffect(() => {
    if (!mapRef.current || !popupRef.current) return;

    console.log(`MapRenderer: Rendering map with ${features.length} features`);

    // Create popup overlay
    overlayRef.current = new Overlay({
      element: popupRef.current,
      autoPan: {
        animation: {
          duration: 250
        }
      }
    });

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

    view.current = newView;

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

    // Notify parent component that map is ready
    onMapReady(map.current, overlayRef.current, newView);

    // Set map as loaded when rendered
    map.current.once('rendercomplete', () => {
      onMapLoaded();
    });

    return () => {
      map.current?.setTarget(undefined);
      map.current = null;
    };
  }, [features, searchCenter]);

  return {
    map,
    overlayRef,
    view: view.current
  };
};
