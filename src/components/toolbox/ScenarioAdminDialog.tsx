
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useScenarios, useDeleteScenario, Scenario } from '@/hooks/useScenarios';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Edit, PlusCircle, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ScenarioFormDialog from './ScenarioFormDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ScenarioAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ScenarioAdminDialog: React.FC<ScenarioAdminDialogProps> = ({ open, onOpenChange }) => {
  const { data: scenarios, isLoading, error } = useScenarios();
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  const deleteMutation = useDeleteScenario();

  const handleEdit = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setShowFormDialog(true);
  };

  const handleAdd = () => {
    setSelectedScenario(null);
    setShowFormDialog(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Gérer les scénarios</DialogTitle>
            <DialogDescription>Ajouter, modifier ou supprimer des scénarios de jeu.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={handleAdd}><PlusCircle className="mr-2 h-4 w-4" /> Ajouter un scénario</Button>
          </div>
          <ScrollArea className="h-[60vh] pr-4">
            {isLoading && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>}
            {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Erreur</AlertTitle><AlertDescription>Impossible de charger les scénarios.</AlertDescription></Alert>}
            <div className="space-y-2">
              {scenarios?.map((scenario) => (
                <div key={scenario.id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div>
                    <p className="font-semibold">{scenario.title}</p>
                    <p className="text-sm text-muted-foreground">{scenario.type === 'short' ? 'Court' : 'Long'} - {scenario.players} joueurs - {scenario.duration}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(scenario)}><Edit className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible et supprimera définitivement le scénario.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(scenario.id)}>Supprimer</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      {showFormDialog && (
        <ScenarioFormDialog
          open={showFormDialog}
          onOpenChange={setShowFormDialog}
          scenario={selectedScenario}
        />
      )}
    </>
  );
};

export default ScenarioAdminDialog;
