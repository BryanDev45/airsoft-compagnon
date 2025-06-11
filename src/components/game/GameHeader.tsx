
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import GameHeaderBadges from './GameHeaderBadges';
import GameHeaderInfo from './GameHeaderInfo';
import GameHeaderActions from './GameHeaderActions';

interface GameHeaderProps {
  title: string;
  gameType: string;
  date: string;
  endDate?: string;
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
  onDelete?: () => void;
  isAdmin?: boolean;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  gameType,
  date,
  endDate,
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
  onEdit,
  onDelete,
  isAdmin = false
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const canEditOrDelete = (isCreator || isAdmin) && !isPastGame;

  const handleDelete = () => {
    if (onDelete) onDelete();
    setShowDeleteDialog(false);
  };

  return (
    <div className="bg-gradient-to-r from-airsoft-dark to-[#1A1F2C] text-white py-8 shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <GameHeaderBadges 
              gameType={gameType}
              isPastGame={isPastGame}
              isAdmin={isAdmin}
              isCreator={isCreator}
            />
            <h1 className="text-3xl font-bold">{title}</h1>
            <GameHeaderInfo 
              date={date}
              endDate={endDate}
              startTime={startTime}
              endTime={endTime}
              address={address}
              zipCode={zipCode}
              city={city}
              participantsCount={participantsCount}
              maxPlayers={maxPlayers}
            />
          </div>

          <GameHeaderActions 
            canEditOrDelete={canEditOrDelete}
            isRegistered={isRegistered}
            loadingRegistration={loadingRegistration}
            isPastGame={isPastGame}
            maxPlayers={maxPlayers}
            participantsCount={participantsCount}
            price={price}
            onEdit={onEdit}
            onDelete={() => setShowDeleteDialog(true)}
            onShare={onShare}
            onRegister={onRegister}
          />
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette partie ? Cette action est irréversible.
              {isAdmin && !isCreator && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                  <strong>Note:</strong> Vous supprimez cette partie en tant qu'administrateur.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GameHeader;
