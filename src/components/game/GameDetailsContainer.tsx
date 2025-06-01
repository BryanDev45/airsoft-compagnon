
import React from 'react';
import GameDetailsTab from './GameDetailsTab';
import GameRulesTab from './GameRulesTab';
import GameParticipantsTab from './GameParticipantsTab';
import GameEquipmentTab from './GameEquipmentTab';
import GameCommentsTab from './GameCommentsTab';
import { GameData, GameParticipant } from '@/types/game';

interface GameDetailsContainerProps {
  selectedTab: string;
  gameData: GameData;
  participants: GameParticipant[];
  creatorRating: number | null;
  navigateToCreatorProfile: () => void;
  isCreator?: boolean;
}

const GameDetailsContainer: React.FC<GameDetailsContainerProps> = ({
  selectedTab,
  gameData,
  participants,
  creatorRating,
  navigateToCreatorProfile,
  isCreator = false
}) => {
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'details':
        return (
          <GameDetailsTab 
            gameData={gameData}
            creatorRating={creatorRating}
            navigateToCreatorProfile={navigateToCreatorProfile}
          />
        );
      case 'rules':
        return <GameRulesTab gameData={gameData} />;
      case 'participants':
        return (
          <GameParticipantsTab 
            participants={participants}
            gameTitle={gameData.title}
            gameDate={gameData.date}
            isCreator={isCreator}
          />
        );
      case 'equipment':
        return <GameEquipmentTab gameData={gameData} />;
      case 'comments':
        return <GameCommentsTab gameId={gameData.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {renderTabContent()}
    </div>
  );
};

export default GameDetailsContainer;
