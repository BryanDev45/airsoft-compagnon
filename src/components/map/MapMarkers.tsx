
import React from 'react';
import MapMarker from './MapMarker';
import { MapEvent } from '@/hooks/useMapData';

interface MapMarkersProps {
  events: MapEvent[];
  stores: any[];
  selectedCategory: string;
  onEventClick: (event: MapEvent) => void;
  onStoreClick: (store: any) => void;
}

const MapMarkers: React.FC<MapMarkersProps> = ({
  events,
  stores,
  selectedCategory,
  onEventClick,
  onStoreClick
}) => {
  return (
    <>
      {/* Marqueurs pour les événements */}
      {(selectedCategory === 'all' || selectedCategory === 'parties') &&
        events.map((event) => (
          <MapMarker
            key={`event-${event.id}`}
            position={[event.latitude, event.longitude]}
            type="event"
            title={event.title}
            onClick={() => onEventClick(event)}
          />
        ))}

      {/* Marqueurs pour les magasins */}
      {(selectedCategory === 'all' || selectedCategory === 'stores') &&
        stores.map((store) => (
          <MapMarker
            key={`store-${store.id}`}
            position={[store.latitude, store.longitude]}
            type="store"
            title={store.name}
            onClick={() => onStoreClick(store)}
          />
        ))}
    </>
  );
};

export default MapMarkers;
