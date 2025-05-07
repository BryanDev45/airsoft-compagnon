
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, Calendar, Clock, MapPin, Users, Check, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface GameHeaderProps {
  title: string;
  gameType: string;
  date: string;
  startTime: string;
  endTime: string;
  address: string;
  zipCode: string;
  city: string;
  participantsCount: number;
  maxPlayers: number;
  price: number | null;
  isRegistered: boolean;
  loadingRegistration: boolean;
  onRegister: () => void;
  onShare: () => void;
  isCreator?: boolean;
  isPastGame?: boolean;
  onEdit?: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  gameType,
  date,
  startTime,
  endTime,
  address,
  zipCode,
  city,
  participantsCount,
  maxPlayers,
  price,
  isRegistered,
  loadingRegistration,
  onRegister,
  onShare,
  isCreator = false,
  isPastGame = false,
  onEdit
}) => {
  // Format date from ISO to readable format
  const formattedDate = date ? format(new Date(date), 'dd MMMM yyyy', {
    locale: fr
  }) : '';

  // Format time
  const formatTime = (timeString: string | null) => {
    if (!timeString) return '';
    // Handle PostgreSQL time format (HH:MM:SS)
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };
  
  const formattedTimeRange = `${formatTime(startTime)} - ${formatTime(endTime)}`;

  return (
    <div className="bg-airsoft-dark text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm mb-2">
              <Badge variant="outline" className="border-white text-white">
                {gameType === "dominicale" ? "Partie Dominicale" : "Opération"}
              </Badge>
              <Badge className="bg-airsoft-red">
                {!isPastGame ? "À venir" : "Terminé"}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-200">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{formattedTimeRange}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{address}, {zipCode} {city}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span>{participantsCount}/{maxPlayers} participants</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            {isCreator && !isPastGame && onEdit && (
              <Button 
                variant="outline" 
                className="bg-blue-600 text-white border-white hover:bg-white hover:text-blue-600" 
                onClick={onEdit}
              >
                <Edit size={16} className="mr-2" />
                Modifier
              </Button>
            )}
            <Button 
              variant="outline" 
              className="bg-airsoft-red text-white border-white hover:bg-white hover:text-airsoft-dark" 
              onClick={onShare}
            >
              <Share2 size={16} className="mr-2" />
              Partager
            </Button>
            <Button 
              className={`${isRegistered ? 'bg-green-600 hover:bg-green-700' : 'bg-airsoft-red hover:bg-red-700'}`} 
              onClick={onRegister} 
              disabled={loadingRegistration || maxPlayers <= participantsCount && !isRegistered}
            >
              {loadingRegistration ? (
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2"></div>
              ) : isRegistered ? (
                <>
                  <Check size={16} className="mr-2" />
                  Inscrit
                </>
              ) : (
                <>S'inscrire - {price}€</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
