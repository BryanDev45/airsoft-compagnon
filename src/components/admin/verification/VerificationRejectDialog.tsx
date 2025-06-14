
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
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    const finalReason = reason.trim() || 'Documents non conformes ou illisibles';
    onConfirm(finalReason);
    onOpenChange(false);
    setReason(''); // Reset pour la prochaine fois
  };

  const handleCancel = () => {
    onOpenChange(false);
    setReason(''); // Reset quand on annule
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
              placeholder="Documents non conformes ou illisibles"
              className="mt-1"
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Si vous laissez ce champ vide, la raison par défaut sera utilisée.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Rejet en cours..." : "Confirmer le rejet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
