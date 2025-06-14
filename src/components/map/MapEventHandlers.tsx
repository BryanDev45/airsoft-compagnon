
import { useRef } from 'react';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import Overlay from 'ol/Overlay';
import { MapEvent, MapStore } from '@/hooks/useGamesData';

interface MapEventHandlersProps {
  map: React.MutableRefObject<Map | null>;
  overlayRef: React.MutableRefObject<Overlay | null>;
  setSelectedEvent: (event: MapEvent | null) => void;
  setSelectedStore: (store: MapStore | null) => void;
}

export const useMapClickHandler = ({
  map,
  overlayRef,
  setSelectedEvent,
  setSelectedStore
}: MapEventHandlersProps) => {
  const setupClickHandler = () => {
    if (!map.current) return;

    map.current.on('click', (event) => {
      const feature = map.current?.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      
      if (feature) {
        const coordinates = (feature.getGeometry() as Point).getCoordinates();
        
        if (feature.get('event')) {
          const eventData = feature.get('event');
          setSelectedEvent(eventData);
          setSelectedStore(null);
          overlayRef.current?.setPosition(coordinates);
        } else if (feature.get('store')) {
          const storeData = feature.get('store');
          setSelectedStore(storeData);
          setSelectedEvent(null);
          overlayRef.current?.setPosition(coordinates);
        }
      } else {
        setSelectedEvent(null);
        setSelectedStore(null);
        overlayRef.current?.setPosition(undefined);
      }
    });
  };

  return { setupClickHandler };
};
