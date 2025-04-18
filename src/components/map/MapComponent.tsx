
import React from 'react';
import { MapPin } from 'lucide-react';

interface MapComponentProps {
  searchCenter: [number, number];
  searchRadius: number;
  filteredEvents: any[];
}

const MapComponent: React.FC<MapComponentProps> = ({ searchCenter, searchRadius, filteredEvents }) => {
  return (
    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center text-gray-500">
        <MapPin className="w-8 h-8 mx-auto mb-2" />
        <p>Carte interactive en cours de chargement...</p>
      </div>
    </div>
  );
};

export default MapComponent;
