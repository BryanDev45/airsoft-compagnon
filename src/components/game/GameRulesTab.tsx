
import React from 'react';
import { GameData } from '@/types/game';

interface GameRulesTabProps {
  gameData: GameData;
}

const GameRulesTab: React.FC<GameRulesTabProps> = ({ gameData }) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Règles de la partie</h2>
      <div className="whitespace-pre-line text-gray-700">
        {gameData.rules}
      </div>
    </>
  );
};

export default GameRulesTab;
