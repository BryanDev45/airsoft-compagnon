import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Euro, Calendar, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { MapEvent } from '@/hooks/useMapData';

interface MarkerProps {
  event: MapEvent;
  onClose: () => void;
}

const MapMarker: React.FC<MarkerProps> = ({ event, onClose }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 min-w-[250px]">
      <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{event.maxPlayers || 20} places max</span>
          </div>
          <div className="flex items-center gap-1">
            <Euro className="h-4 w-4" />
            <span>PAF: {event.price || 0}€</span>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Link to={`/game/${event.id}`}>
          <Button className="bg-airsoft-red hover:bg-red-700">
            Voir plus
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MapMarker;
