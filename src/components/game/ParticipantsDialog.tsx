
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import type { GameParticipant } from '@/types/game';

interface ParticipantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participants: GameParticipant[];
  isLoading: boolean;
}

const ParticipantsDialog: React.FC<ParticipantsDialogProps> = ({
  open,
  onOpenChange,
  participants,
  isLoading
}) => {
  const navigate = useNavigate();

  // Helper function to get initials from username
  const getInitials = (username: string | null): string => {
    if (!username) return '??';
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Participants ({participants?.length || 0})</DialogTitle>
          <DialogDescription>
            Voici la liste des joueurs inscrits à cet événement.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-airsoft-red border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {participants.map((participant, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Avatar>
                      <AvatarImage 
                        src={participant.profile?.avatar || "https://randomuser.me/api/portraits/men/1.jpg"} 
                        alt={participant.profile?.username || "Participant"} 
                        className="w-12 h-12 object-cover" 
                      />
                      <AvatarFallback>{getInitials(participant.profile?.username)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <div className="font-medium">{participant.profile?.username || "Participant"}</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        {participant.role === "Organisateur" && (
                          <Badge variant="outline" className="text-xs border-airsoft-red text-airsoft-red">
                            Organisateur
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-shrink-0" 
                      onClick={() => navigate(`/profile/${participant.profile?.username}`)}
                    >
                      <User size={14} className="mr-1" />
                      Profil
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline">
              <X size={14} className="mr-2" /> Fermer
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantsDialog;
