
import React from 'react';
import { GameData, GameParticipant } from '@/types/game';
import { Profile } from '@/types/profile';
import GameTabs from './GameTabs';
import GameCommentsTab from './GameCommentsTab';
import GameParticipantsTab from './GameParticipantsTab';
import GameDetailsTab from './GameDetailsTab';
import GameRulesTab from './GameRulesTab';
import GameEquipmentTab from './GameEquipmentTab';

interface GameDetailsContainerProps {
  selectedTab: string;
  gameData: GameData;
  participants: GameParticipant[];
  creatorRating: number | null;
  navigateToCreatorProfile: () => void;
}

const GameDetailsContainer: React.FC<GameDetailsContainerProps> = ({
  selectedTab,
  gameData,
  participants,
  creatorRating,
  navigateToCreatorProfile
}) => {
  return (
    <div className="mt-4 bg-white rounded-lg shadow-sm p-6">
      {selectedTab === 'details' && (
        <GameDetailsTab 
          description={gameData.description} 
          creator={gameData.creator} 
          creatorRating={creatorRating}
          navigateToCreatorProfile={navigateToCreatorProfile}
        />
      )}
      {selectedTab === 'participants' && <GameParticipantsTab participants={participants} />}
      {selectedTab === 'comments' && <GameCommentsTab gameId={gameData.id} />}
      {selectedTab === 'rules' && <GameRulesTab rules={gameData.rules} />}
      {selectedTab === 'equipment' && (
        <GameEquipmentTab
          aegFpsMin={gameData.aeg_fps_min}
          aegFpsMax={gameData.aeg_fps_max}
          dmrFpsMax={gameData.dmr_fps_max}
          eyeProtectionRequired={gameData.eye_protection_required}
          fullFaceProtectionRequired={gameData.full_face_protection_required}
          hasToilets={gameData.has_toilets}
          hasParking={gameData.has_parking}
          hasEquipmentRental={gameData.has_equipment_rental}
          manualValidation={gameData.manual_validation}
          isPrivate={gameData.is_private}
        />
      )}
    </div>
  );
};

export default GameDetailsContainer;
