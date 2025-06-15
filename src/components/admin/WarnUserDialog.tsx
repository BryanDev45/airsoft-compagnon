
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface WarnUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
  username: string;
}

const WarnUserDialog: React.FC<WarnUserDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  username,
}) => {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!open) {
      setReason('');
    }
  }, [open]);

  const handleConfirm = () => {
    onConfirm(reason);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Avertir {username}</DialogTitle>
          <DialogDescription>
            Envoyer un avertissement à cet utilisateur. Il recevra une notification. La raison sera enregistrée et visible par les administrateurs.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="warning-reason">Raison de l'avertissement</Label>
            <Textarea
              id="warning-reason"
              placeholder="Ex: Comportement inapproprié dans les commentaires du jeu X..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Annuler
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={isLoading || !reason.trim()}
            variant="destructive"
          >
            {isLoading ? 'Envoi...' : "Envoyer l'avertissement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WarnUserDialog;
