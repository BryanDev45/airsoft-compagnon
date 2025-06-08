
import React from 'react';
import MapComponent from './MapComponent';
import { MapEvent, MapStore } from '@/hooks/useMapData';

interface MapContainerProps {
  events: MapEvent[];
  stores: MapStore[];
  loading: boolean;
  selectedCategory: string;
  centerCoordinates: [number, number] | null;
  onEventClick: (event: MapEvent) => void;
  onStoreClick: (store: MapStore) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({
  events,
  stores,
  loading,
  selectedCategory,
  centerCoordinates,
  onEventClick,
  onStoreClick
}) => {
  if (loading) {
    return (
      <div className="h-96 w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-airsoft-red mx-auto mb-2"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-md">
      <MapComponent
        events={events}
        stores={stores}
        selectedCategory={selectedCategory}
        centerCoordinates={centerCoordinates}
        onEventClick={onEventClick}
        onStoreClick={onStoreClick}
      />
    </div>
  );
};

export default MapContainer;
