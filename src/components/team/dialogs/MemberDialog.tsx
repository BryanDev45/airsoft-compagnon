
import React from 'react';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MemberDialogProps {
  selectedMember: any;
  showMemberDialog: boolean;
  setShowMemberDialog: (show: boolean) => void;
}

const MemberDialog = ({ selectedMember, showMemberDialog, setShowMemberDialog }: MemberDialogProps) => {
  if (!selectedMember) return null;

  return (
    <Dialog open={showMemberDialog} onOpenChange={setShowMemberDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {selectedMember.username}
            {selectedMember.verified && (
              <img 
                src="/lovable-uploads/381c6357-0426-45d3-8262-7b1be5c1bc96.png" 
                alt="Vérifié" 
                className="w-5 h-5 ml-1"
              />
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img 
              src={selectedMember.avatar} 
              alt={selectedMember.username} 
              className="w-20 h-20 rounded-full object-cover"
            />
            {selectedMember.isTeamLeader && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <img 
                  src="/lovable-uploads/3c025802-3046-4c34-ae5e-2328e941b479.png" 
                  alt="Team Leader" 
                  className="w-6 h-6"
                />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold">{selectedMember.username}</h3>
            <p className="text-sm text-gray-500">{selectedMember.role}</p>
            <p className="text-xs text-gray-400">Membre depuis {selectedMember.joinedTeam}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Spécialité</h4>
            <p className="text-sm">{selectedMember.specialty}</p>
          </div>
          {selectedMember.isTeamLeader && (
            <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2">
                <Shield className="text-yellow-600" size={16} />
                <p className="text-sm font-medium text-yellow-800">Chef d'équipe</p>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                Ce joueur est le fondateur et leader de l'équipe
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => setShowMemberDialog(false)}
          >
            Fermer
          </Button>
          <Button 
            className="bg-airsoft-red hover:bg-red-700"
            asChild
          >
            <Link to={`/user/${selectedMember.username}`}>Voir profil complet</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MemberDialog;
