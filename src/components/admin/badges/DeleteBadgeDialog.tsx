
import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface DeleteBadgeDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
  badgeName?: string;
}

const DeleteBadgeDialog: React.FC<DeleteBadgeDialogProps> = ({ isOpen, onOpenChange, onConfirm, isDeleting, badgeName }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce badge ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Le badge "{badgeName}" sera définitivement supprimé.
            Les utilisateurs qui possèdent ce badge le perdront.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Annuler
          </Button>
          <Button onClick={onConfirm} disabled={isDeleting} variant="destructive">
            {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Suppression...</> : 'Supprimer'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBadgeDialog;
