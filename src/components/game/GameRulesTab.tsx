
import React from 'react';

interface GameRulesTabProps {
  rules: string;
}

const GameRulesTab: React.FC<GameRulesTabProps> = ({ rules }) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Règles de la partie</h2>
      <div className="whitespace-pre-line text-gray-700">
        {rules}
      </div>
    </>
  );
};

export default GameRulesTab;
