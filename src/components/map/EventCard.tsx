
import { Calendar, MapPin, Users, Euro } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapEvent } from '@/hooks/useMapData';
import { useAuth } from '@/hooks/useAuth';
import GameImageCarousel from './GameImageCarousel';
import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';

interface EventCardProps {
  event: MapEvent;
}

const EventCard = ({ event }: EventCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Récupérer le nombre de participants pour cette partie
  const { data: participantCount = 0 } = useQuery({
    queryKey: ['participant-count', event.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('game_participants')
        .select('id')
        .eq('game_id', event.id)
        .eq('status', 'Confirmé');
      
      if (error) throw error;
      return data?.length || 0;
    },
  });

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
        <div className="h-48">
          <GameImageCarousel 
            images={event.images || []} 
            title={event.title} 
          />
        </div>
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
                <span>{participantCount}/{event.maxPlayers || 20} joueurs</span>
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
