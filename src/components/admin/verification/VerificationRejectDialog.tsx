
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface VerificationRejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

export const VerificationRejectDialog = ({ 
  open, 
  onOpenChange, 
  onConfirm, 
  isLoading = false 
}: VerificationRejectDialogProps) => {
  const [reason, setReason] = useState('Documents non conformes ou illisibles');

  const handleConfirm = () => {
    onConfirm(reason);
    onOpenChange(false);
    setReason('Documents non conformes ou illisibles'); // Reset pour la prochaine fois
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rejeter la demande de vérification</DialogTitle>
          <DialogDescription>
            Veuillez indiquer la raison du rejet. Cette information sera envoyée à l'utilisateur.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="reason">Raison du rejet</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Expliquez pourquoi la demande est rejetée..."
              className="mt-1"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim() || isLoading}
          >
            {isLoading ? "Rejet en cours..." : "Confirmer le rejet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
