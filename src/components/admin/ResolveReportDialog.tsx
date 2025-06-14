
import React, { useState } from 'react';
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

interface ResolveReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (adminNotes: string) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

const ResolveReportDialog: React.FC<ResolveReportDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  title = "Résoudre le signalement",
  description = "Ajoutez un commentaire sur les actions prises pour résoudre ce signalement."
}) => {
  const [adminNotes, setAdminNotes] = useState('');

  const handleConfirm = () => {
    onConfirm(adminNotes);
    setAdminNotes('');
  };

  const handleCancel = () => {
    setAdminNotes('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="admin-notes">Commentaire administrateur</Label>
            <Textarea
              id="admin-notes"
              placeholder="Décrivez les actions prises pour résoudre ce signalement..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
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
            disabled={isLoading || !adminNotes.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Résolution...' : 'Résoudre'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResolveReportDialog;
