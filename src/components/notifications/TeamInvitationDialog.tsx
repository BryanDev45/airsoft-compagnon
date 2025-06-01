
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserCheck, UserMinus } from 'lucide-react';

interface TeamInvitationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitation: {
    id: string;
    teams: { name: string; logo?: string };
    profiles: { username: string };
  };
  onAccept: (invitationId: string) => void;
  onReject: (invitationId: string) => void;
  isProcessing: boolean;
}

const TeamInvitationDialog: React.FC<TeamInvitationDialogProps> = ({
  open,
  onOpenChange,
  invitation,
  onAccept,
  onReject,
  isProcessing
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invitation d'équipe</DialogTitle>
          <DialogDescription>
            Que souhaitez-vous faire avec cette invitation ?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
            {invitation.teams.logo && (
              <img 
                src={invitation.teams.logo} 
                alt={invitation.teams.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-medium">{invitation.teams.name}</p>
              <p className="text-sm text-gray-600">
                Invité par {invitation.profiles.username}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => onAccept(invitation.id)}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              <UserCheck size={16} className="mr-2" />
              Accepter l'invitation
            </Button>
            <Button 
              variant="outline"
              onClick={() => onReject(invitation.id)}
              disabled={isProcessing}
            >
              <UserMinus size={16} className="mr-2" />
              Refuser l'invitation
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamInvitationDialog;
