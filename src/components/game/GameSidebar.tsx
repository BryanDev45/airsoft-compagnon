
import React from 'react';
import GameInfoCard from './GameInfoCard';
import GameLocationCard from './GameLocationCard';

interface GameSidebarProps {
  gameData: {
    price: number;
    date: string;
    start_time: string;
    end_time: string;
    max_players: number;
    address: string;
    zip_code: string;
    city: string;
    longitude?: number;
    latitude?: number;
  };
  participantsCount: number;
  isRegistered: boolean;
  loadingRegistration: boolean;
  onRegister: () => void;
}

const GameSidebar: React.FC<GameSidebarProps> = ({
  gameData,
  participantsCount,
  isRegistered,
  loadingRegistration,
  onRegister
}) => {
  return (
    <div className="space-y-6">
      <GameInfoCard
        price={gameData.price}
        date={gameData.date}
        startTime={gameData.start_time}
        endTime={gameData.end_time}
        participantsCount={participantsCount}
        maxPlayers={gameData.max_players}
        isRegistered={isRegistered}
        loadingRegistration={loadingRegistration}
        onRegister={onRegister}
      />
      <GameLocationCard
        address={gameData.address}
        zipCode={gameData.zip_code}
        city={gameData.city}
        coordinates={[gameData.longitude || 0, gameData.latitude || 0]}
      />
    </div>
  );
};

export default GameSidebar;
