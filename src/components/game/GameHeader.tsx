import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, Calendar, Clock, MapPin, Users, Check, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
interface GameHeaderProps {
  title: string;
  gameType: string;
  date: string;
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

  // Format date from ISO to readable format
  const formattedDate = date ? format(new Date(date), 'dd MMMM yyyy', {
    locale: fr
  }) : '';

  // Format time
  const formatTime = (timeString: string | null) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };
  const formattedTimeRange = `${formatTime(startTime)} - ${formatTime(endTime)}`;

  // Show edit/delete buttons if user is creator OR admin (but not for past games)
  const canEditOrDelete = (isCreator || isAdmin) && !isPastGame;
  return <div className="bg-gradient-to-r from-airsoft-dark to-[#1A1F2C] text-white py-8 shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Badge variant="outline" className="border-white text-white bg-black/20 backdrop-blur-sm">
                {gameType === "dominicale" ? "Partie Dominicale" : gameType}
              </Badge>
              <Badge className={`${!isPastGame ? 'bg-airsoft-red' : 'bg-gray-600'}`}>
                {!isPastGame ? "À venir" : "Terminé"}
              </Badge>
              {isAdmin && !isCreator}
            </div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-200 mt-2">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-airsoft-red" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-airsoft-red" />
                <span>{formattedTimeRange}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-airsoft-red" />
                <span className="truncate">{address}, {zipCode} {city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-airsoft-red" />
                <span>
                  <span className="font-medium">{participantsCount}</span>
                  <span className="text-gray-300">/{maxPlayers}</span> participants
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0 md:flex-col lg:flex-row">
            <div className="flex gap-2">
              {canEditOrDelete && <>
                  {onDelete && <Button variant="outline" className="bg-red-600 text-white border-red-500 hover:bg-red-700 hover:text-white" onClick={() => setShowDeleteDialog(true)}>
                      <Trash2 size={16} className="mr-2" />
                      Supprimer
                    </Button>}
                  {onEdit && <Button variant="outline" className="bg-blue-600 text-white border-white hover:bg-white hover:text-blue-600" onClick={onEdit}>
                      <Edit size={16} className="mr-2" />
                      Modifier
                    </Button>}
                </>}
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" className="bg-airsoft-red text-white border-white hover:bg-white hover:text-airsoft-dark" onClick={onShare}>
                <Share2 size={16} className="mr-2" />
                Partager
              </Button>
              <Button className={`${isRegistered ? 'bg-green-600 hover:bg-green-700' : 'bg-airsoft-red hover:bg-red-700'} flex-grow sm:flex-grow-0`} onClick={onRegister} disabled={loadingRegistration || maxPlayers <= participantsCount && !isRegistered || isPastGame}>
                {loadingRegistration ? <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2"></div> : isRegistered ? <>
                    <Check size={16} className="mr-2" />
                    Inscrit
                  </> : isPastGame ? <>Partie terminée</> : <>S'inscrire {price ? `- ${price}€` : ''}</>}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette partie ? Cette action est irréversible.
              {isAdmin && !isCreator && <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                  <strong>Note:</strong> Vous supprimez cette partie en tant qu'administrateur.
                </div>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
            if (onDelete) onDelete();
            setShowDeleteDialog(false);
          }} className="bg-red-600 hover:bg-red-700 text-white">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
export default GameHeader;