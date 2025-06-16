
import React from 'react';
import GameInfoCard from './GameInfoCard';
import GameLocationCard from './GameLocationCard';
import { GameData } from '@/types/game';
import { Profile } from '@/types/profile';

interface GameSidebarProps {
  gameData: GameData;
  participantsCount: number;
  isRegistered: boolean;
  loadingRegistration: boolean;
  onRegister: () => void;
  userProfile?: Profile | null;
  user?: any;
}

const GameSidebar: React.FC<GameSidebarProps> = ({
  gameData,
  participantsCount,
  isRegistered,
  loadingRegistration,
  onRegister,
  userProfile,
  user
}) => {
  return (
    <div className="space-y-6">
      <GameInfoCard
        price={gameData.price || null}
        date={gameData.date}
        endDate={gameData.end_date}
        startTime={gameData.start_time}
        endTime={gameData.end_time}
        participantsCount={participantsCount}
        maxPlayers={gameData.max_players}
        isRegistered={isRegistered}
        loadingRegistration={loadingRegistration}
        onRegister={onRegister}
        gameData={gameData}
        userProfile={userProfile}
        user={user}
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
