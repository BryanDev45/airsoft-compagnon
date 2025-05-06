
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameData: {
    title: string;
    date: string;
    start_time: string;
    end_time: string;
    address: string;
    zip_code: string;
    city: string;
  };
  loadingRegistration: boolean;
  onUnregister: () => void;
}

const RegistrationDialog: React.FC<RegistrationDialogProps> = ({
  open,
  onOpenChange,
  gameData,
  loadingRegistration,
  onUnregister
}) => {
  // Format date from ISO to readable format
  const formattedDate = gameData.date ? format(new Date(gameData.date), 'dd MMMM yyyy', {
    locale: fr
  }) : '';

  // Format time
  const formatTime = (timeString: string | null) => {
    if (!timeString) return '';
    // Handle PostgreSQL time format (HH:MM:SS)
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };
  
  const formattedTimeRange = `${formatTime(gameData.start_time)} - ${formatTime(gameData.end_time)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gérer votre inscription</DialogTitle>
          <DialogDescription>
            Vous êtes déjà inscrit à cette partie. Que souhaitez-vous faire ?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="mb-4">
            <strong>Partie :</strong> {gameData.title}<br />
            <strong>Date :</strong> {formattedDate}<br />
            <strong>Heure :</strong> {formattedTimeRange}<br />
            <strong>Lieu :</strong> {gameData.address}, {gameData.zip_code} {gameData.city}
          </p>
          
          <div className="flex flex-col gap-4">
            <Button 
              variant="destructive" 
              onClick={onUnregister} 
              disabled={loadingRegistration}
            >
              {loadingRegistration ? (
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2"></div>
              ) : (
                <X size={16} className="mr-2" />
              )}
              Se désinscrire
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationDialog;
