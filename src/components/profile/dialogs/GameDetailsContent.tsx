
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { formatGameDate } from '@/utils/dateUtils';
import { Calendar, Clock, MapPin, Users, Euro } from 'lucide-react';

interface GameDetailsContentProps {
  selectedGame: any;
}

const GameDetailsContent: React.FC<GameDetailsContentProps> = ({ selectedGame }) => {
  const formatGameDateDisplay = (game: any) => {
    if (!game) {
      console.warn('Game object is missing:', game);
      return 'Date non disponible';
    }
    
    const startDate = game.date || game.rawDate;
    const endDate = game.end_date;
    
    if (!startDate) {
      console.warn('No valid start date found in game object:', game);
      return 'Date non disponible';
    }
    
    try {
      return formatGameDate(startDate, endDate);
    } catch (error) {
      console.error('Error formatting game date:', error, { startDate, endDate, game });
      return 'Date non disponible';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="text-airsoft-red flex-shrink-0" size={18} />
          <span className="font-medium">{formatGameDateDisplay(selectedGame)}</span>
        </div>
        
        {selectedGame.time && (
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="text-airsoft-red flex-shrink-0" size={18} />
            <span>{selectedGame.time}</span>
          </div>
        )}
        
        <div className="flex items-start gap-2 text-gray-700">
          <MapPin className="text-airsoft-red flex-shrink-0" size={18} />
          <div>
            <p>{selectedGame.address || selectedGame.location || 'Lieu non spécifié'}</p>
            {selectedGame.zip_code && (
              <p>{selectedGame.zip_code}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-gray-700">
          <Users className="text-airsoft-red flex-shrink-0" size={18} />
          <span>
            <span className="font-medium">
              {selectedGame.participants !== undefined 
                ? selectedGame.participants 
                : (selectedGame.participantsCount !== undefined ? selectedGame.participantsCount : 0)
              }
            </span>
            <span className="text-gray-500">
              /{selectedGame.maxParticipants || selectedGame.max_players || '?'}
            </span> participants
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-700">
          <Euro className="text-airsoft-red flex-shrink-0" size={18} />
          <span>
            {selectedGame.price !== undefined && selectedGame.price !== null 
              ? `${selectedGame.price}€` 
              : 'Prix non spécifié'}
          </span>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <Badge className={`${
            selectedGame.status === 'À venir' 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gray-600 hover:bg-gray-700'
          }`}>
            {selectedGame.status}
          </Badge>
        </div>
        
        <div className="border-t border-gray-200 pt-3 mt-2">
          <p className="font-medium">Votre rôle : <span className="font-normal">{selectedGame.role}</span></p>
          {selectedGame.team && selectedGame.team !== 'Indéfini' && (
            <p className="font-medium mt-1">Équipe : <span className="font-normal">{selectedGame.team}</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameDetailsContent;
