
import React from 'react';
import { Button } from "@/components/ui/button";
import { Share2, Check, Edit, Trash2 } from 'lucide-react';

interface GameHeaderActionsProps {
  canEditOrDelete: boolean;
  isRegistered: boolean;
  loadingRegistration: boolean;
  isPastGame: boolean;
  maxPlayers: number;
  participantsCount: number;
  price: number | null;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare: () => void;
  onRegister: () => void;
}

const GameHeaderActions: React.FC<GameHeaderActionsProps> = ({
  canEditOrDelete,
  isRegistered,
  loadingRegistration,
  isPastGame,
  maxPlayers,
  participantsCount,
  price,
  onEdit,
  onDelete,
  onShare,
  onRegister
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4 md:mt-0 md:flex-col lg:flex-row">
      <div className="flex gap-2">
        {canEditOrDelete && (
          <>
            {onDelete && (
              <Button
                variant="outline"
                className="bg-red-600 text-white border-red-500 hover:bg-red-700 hover:text-white"
                onClick={onDelete}
              >
                <Trash2 size={16} className="mr-2" />
                Supprimer
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline"
                className="bg-blue-600 text-white border-white hover:bg-white hover:text-blue-600"
                onClick={onEdit}
              >
                <Edit size={16} className="mr-2" />
                Modifier
              </Button>
            )}
          </>
        )}
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          className="bg-airsoft-red text-white border-white hover:bg-white hover:text-airsoft-dark"
          onClick={onShare}
        >
          <Share2 size={16} className="mr-2" />
          Partager
        </Button>
        <Button
          className={`${
            isRegistered
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-airsoft-red hover:bg-red-700'
          } flex-grow sm:flex-grow-0`}
          onClick={onRegister}
          disabled={
            loadingRegistration ||
            (maxPlayers <= participantsCount && !isRegistered) ||
            isPastGame
          }
        >
          {loadingRegistration ? (
            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2"></div>
          ) : isRegistered ? (
            <>
              <Check size={16} className="mr-2" />
              Inscrit
            </>
          ) : isPastGame ? (
            <>Partie terminée</>
          ) : (
            <>S'inscrire {price ? `- ${price}€` : ''}</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default GameHeaderActions;
