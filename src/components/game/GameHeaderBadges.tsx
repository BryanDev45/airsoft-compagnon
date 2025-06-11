
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface GameHeaderBadgesProps {
  gameType: string;
  isPastGame: boolean;
  isAdmin: boolean;
  isCreator: boolean;
}

const GameHeaderBadges: React.FC<GameHeaderBadgesProps> = ({
  gameType,
  isPastGame,
  isAdmin,
  isCreator
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <Badge variant="outline" className="border-white text-white bg-black/20 backdrop-blur-sm">
        {gameType === "dominicale" ? "Partie Dominicale" : gameType}
      </Badge>
      <Badge className={`${!isPastGame ? 'bg-airsoft-red' : 'bg-gray-600'}`}>
        {!isPastGame ? "À venir" : "Terminé"}
      </Badge>
      {isAdmin && !isCreator && (
        <Badge variant="outline" className="border-yellow-400 text-yellow-400 bg-yellow-400/10">
          Admin
        </Badge>
      )}
    </div>
  );
};

export default GameHeaderBadges;
