
import { Calendar, MapPin, Users, Euro } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MapEvent } from '@/hooks/useMapData';
import GameImageCarousel from './GameImageCarousel';

interface EventCardProps {
  event: MapEvent;
}

const EventCard = ({ event }: EventCardProps) => {
  const handleCardClick = (e: React.MouseEvent) => {
    // Empêcher la propagation d'événements qui pourraient causer des problèmes d'auth
    e.stopPropagation();
  };

  return (
    <Link 
      to={`/game/${event.id}`} 
      className="block"
      onClick={handleCardClick}
    >
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        <GameImageCarousel 
          images={event.images || []} 
          title={event.title} 
        />
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-4">
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
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
