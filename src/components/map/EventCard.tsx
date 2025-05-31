
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Euro, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import GameImageCarousel from './GameImageCarousel';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    department: string;
    type: string;
    maxPlayers?: number;
    price?: number;
    images?: string[];
    image?: string;
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Redirect to login if user is not authenticated
      navigate('/login', { 
        state: { 
          from: `/game/${event.id}`,
          message: "Vous devez être connecté pour voir les détails d'une partie"
        }
      });
      return;
    }
    
    // Navigate to game details if user is authenticated
    navigate(`/game/${event.id}`);
  };

  const getTypeDisplayName = (type: string) => {
    switch (type.toLowerCase()) {
      case 'dominicale':
        return 'Partie Dominicale';
      case 'cqb':
        return 'CQB';
      case 'woodland':
        return 'Woodland';
      case 'milsim':
        return 'MilSim';
      default:
        return type;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <GameImageCarousel 
          images={event.images || (event.image ? [event.image] : [])} 
          title={event.title}
        />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            {getTypeDisplayName(event.type)}
          </Badge>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{event.title}</h3>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-airsoft-red" />
            <span>{event.date}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-airsoft-red" />
            <span>{event.location} ({event.department})</span>
          </div>
          
          {event.maxPlayers && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-airsoft-red" />
              <span>Max {event.maxPlayers} joueurs</span>
            </div>
          )}
          
          {event.price !== undefined && event.price !== null && (
            <div className="flex items-center gap-2">
              <Euro className="h-4 w-4 text-airsoft-red" />
              <span>{event.price === 0 ? 'Gratuit' : `${event.price}€`}</span>
            </div>
          )}
        </div>
        
        <Button 
          onClick={handleViewDetails}
          className="w-full bg-airsoft-red hover:bg-red-700 text-white flex items-center justify-center gap-2"
        >
          {!user && <Lock className="h-4 w-4" />}
          Voir les détails
        </Button>
      </div>
    </div>
  );
};

export default EventCard;
