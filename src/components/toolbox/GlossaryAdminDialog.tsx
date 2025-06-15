
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGlossaryTerms, useDeleteGlossaryTerm, GlossaryTerm } from '@/hooks/useGlossary';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import GlossaryFormDialog from './GlossaryFormDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface GlossaryAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GlossaryAdminDialog: React.FC<GlossaryAdminDialogProps> = ({ open, onOpenChange }) => {
  const { data: terms, isLoading } = useGlossaryTerms();
  const deleteMutation = useDeleteGlossaryTerm();
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);

  const handleAddNew = () => {
    setSelectedTerm(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (term: GlossaryTerm) => {
    setSelectedTerm(term);
    setFormDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Gérer le glossaire</DialogTitle>
          <DialogDescription>
            Ajouter, modifier ou supprimer des termes du glossaire.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un terme
          </Button>
        </div>
        <ScrollArea className="h-[60vh] border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Terme</TableHead>
                <TableHead>Définition</TableHead>
                <TableHead className="w-[120px]">Catégorie</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : (
                terms?.map((term) => (
                  <TableRow key={term.id}>
                    <TableCell className="font-medium">{term.term}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{term.definition}</TableCell>
                    <TableCell>
                      <span className="text-xs px-2 py-1 bg-muted rounded-full">
                        {term.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(term)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                             <Trash2 className="h-4 w-4" />
                           </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible et supprimera définitivement le terme "{term.term}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(term.id)} className="bg-destructive hover:bg-destructive/90">
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
        <GlossaryFormDialog
          open={formDialogOpen}
          onOpenChange={setFormDialogOpen}
          term={selectedTerm}
        />
      </DialogContent>
    </Dialog>
  );
};

export default GlossaryAdminDialog;
