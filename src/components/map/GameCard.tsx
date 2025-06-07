
import React from 'react';
import { Calendar, Users, Euro, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapEvent } from '@/hooks/useMapData';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import GameImageCarousel from './GameImageCarousel';
import { formatGameDateRange } from '@/utils/dateUtils';

interface GameCardProps {
  event: MapEvent;
  participantCount: number;
}

const GameCard: React.FC<GameCardProps> = ({ event, participantCount }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGameDetailsClick = (gameId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/game/${gameId}`);
  };

  const maxPlayers = event.maxPlayers || 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="h-48 w-full overflow-hidden">
          <GameImageCarousel 
            images={event.images || []} 
            title={event.title} 
          />
        </div>
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="secondary" className="bg-white/90 text-gray-700">
            {event.type}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {event.location} ({event.department})
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          {event.date}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          {participantCount}/{maxPlayers} joueurs
        </div>
        {event.price !== undefined && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Euro className="h-4 w-4" />
            {event.price}€
          </div>
        )}
        <Button 
          className="w-full mt-4 bg-airsoft-red hover:bg-red-700" 
          onClick={() => handleGameDetailsClick(event.id)}
        >
          Voir les détails
        </Button>
      </CardContent>
    </Card>
  );
};

export default GameCard;
