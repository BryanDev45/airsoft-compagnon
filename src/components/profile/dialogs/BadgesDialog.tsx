
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BadgesDialogProps {
  showBadgesDialog: boolean;
  setShowBadgesDialog: (show: boolean) => void;
  user: any;
}

const BadgesDialog: React.FC<BadgesDialogProps> = ({
  showBadgesDialog,
  setShowBadgesDialog,
  user
}) => {
  return (
    <Dialog open={showBadgesDialog} onOpenChange={setShowBadgesDialog}>
      <DialogContent className="sm:max-w-lg max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tous les badges de {user?.username || 'l\'utilisateur'}</DialogTitle>
        </DialogHeader>
        <div className="p-2">
          {/* Implementing this would require passing badges to this component */}
          <p>Fonctionnalité à venir.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BadgesDialog;
