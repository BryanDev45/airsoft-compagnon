
import React from 'react';
import { Calendar, MapPin, Users, Euro, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MapEvent } from '@/hooks/useMapData';
import GameImageCarousel from './GameImageCarousel';

interface MapMarkerProps {
  event: MapEvent;
  onClose: () => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({ event, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleViewMore = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/game/${event.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-[400px] border border-gray-200">
      {/* Images carousel */}
      <div className="relative h-40">
        <GameImageCarousel 
          images={event.images || []} 
          title={event.title} 
        />
      </div>
      
      {/* Contenu de la partie */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg text-gray-900 pr-2">{event.title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            {event.date}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            {event.location} ({event.department})
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {event.maxPlayers || 20} places max
            </div>
            
            <div className="flex items-center gap-1">
              <Euro className="h-4 w-4" />
              {event.price || 0}€
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleViewMore}
          className="w-full mt-3 bg-airsoft-red hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
        >
          Voir plus
        </button>
      </div>
    </div>
  );
};

export default MapMarker;
