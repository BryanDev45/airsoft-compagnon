
import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Game {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  status: string;
  role: string;
}

interface GameListProps {
  games: Game[];
  onGameClick?: (game: Game) => void;
}

const GameList: React.FC<GameListProps> = ({ games, onGameClick }) => {
  if (!games || games.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">
          Pas encore de parties enregistrées
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <div 
          key={game.id}
          onClick={() => onGameClick && onGameClick(game)}
          className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="w-full sm:w-24 h-24 overflow-hidden rounded-md">
            <img 
              src={game.image || '/placeholder.svg'} 
              alt={game.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-semibold text-lg">{game.title}</h3>
              <div>
                <Badge className={
                  game.status === 'À venir' 
                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                    : game.status === 'Terminé'
                      ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                }>
                  {game.status}
                </Badge>
              </div>
            </div>
            
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{game.date}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{game.location}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{game.role}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameList;
