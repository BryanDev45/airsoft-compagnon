
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { formatGameDate, formatGameTimeRange } from '@/utils/dateUtils';

interface GameInfoCardProps {
  price: number | null;
  date: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  participantsCount: number;
  maxPlayers: number;
  isRegistered: boolean;
  loadingRegistration: boolean;
  onRegister: () => void;
}

const GameInfoCard: React.FC<GameInfoCardProps> = ({
  price,
  date,
  endDate,
  startTime,
  endTime,
  participantsCount,
  maxPlayers,
  isRegistered,
  loadingRegistration,
  onRegister
}) => {
  // Utiliser formatGameDate qui gère l'affichage conditionnel des plages de dates
  const formattedDate = formatGameDate(date, endDate);
  const formattedTimeRange = formatGameTimeRange(startTime, endTime);
  
  // Vérifie si la partie est déjà passée
  const isPastGame = new Date(date) < new Date();

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Informations</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Prix</span>
            <span className="font-semibold">{price}€</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Date</span>
            <span>{formattedDate}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Horaires</span>
            <span>{formattedTimeRange}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Capacité</span>
            <span>
              <span className="font-semibold">{participantsCount}</span>
              /{maxPlayers} participants
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Place disponible</span>
            <span className="font-semibold">{maxPlayers - participantsCount}</span>
          </div>
        </div>
        
        <div className="mt-6">
          <Button 
            className={`w-full ${isRegistered ? 'bg-green-600 hover:bg-green-700' : 'bg-airsoft-red hover:bg-red-700'}`} 
            onClick={onRegister} 
            disabled={loadingRegistration || (maxPlayers <= participantsCount && !isRegistered) || isPastGame}
          >
            {loadingRegistration ? (
              <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2"></div>
            ) : isRegistered ? (
              <>
                <Check size={16} className="mr-2" />
                Inscrit - Gérer mon inscription
              </>
            ) : isPastGame ? (
              <>Partie terminée</>
            ) : (
              <>
                S'inscrire à la partie
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameInfoCard;
