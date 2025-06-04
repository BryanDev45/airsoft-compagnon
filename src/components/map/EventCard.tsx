
import { Calendar, MapPin, Users, Euro } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { MapEvent } from '@/hooks/useMapData';
import { useAuth } from '@/hooks/useAuth';
import GameImageCarousel from './GameImageCarousel';

interface EventCardProps {
  event: MapEvent;
}

const EventCard = ({ event }: EventCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    navigate(`/game/${event.id}`);
  };

  return (
    <div 
      className="block cursor-pointer"
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
    </div>
  );
};

export default EventCard;
