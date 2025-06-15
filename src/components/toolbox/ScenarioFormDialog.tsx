
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useAddScenario, useUpdateScenario, Scenario } from '@/hooks/useScenarios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface ScenarioFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scenario: Scenario | null;
}

const ScenarioFormDialog: React.FC<ScenarioFormDialogProps> = ({ open, onOpenChange, scenario }) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [players, setPlayers] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState(''); // Comma-separated
  const [type, setType] = useState<'short' | 'long'>('short');

  const addMutation = useAddScenario();
  const updateMutation = useUpdateScenario();

  useEffect(() => {
    if (scenario) {
      setTitle(scenario.title);
      setDuration(scenario.duration);
      setPlayers(scenario.players);
      setDescription(scenario.description);
      setRules(scenario.rules.join(', '));
      setType(scenario.type);
    } else {
      // Reset form
      setTitle('');
      setDuration('');
      setPlayers('');
      setDescription('');
      setRules('');
      setType('short');
    }
  }, [scenario]);

  const handleSubmit = () => {
    const rulesArray = rules.split(',').map(rule => rule.trim()).filter(Boolean);
    const scenarioData = { title, duration, players, description, rules: rulesArray, type };
    if (scenario) {
      updateMutation.mutate({ ...scenarioData, id: scenario.id }, {
        onSuccess: () => onOpenChange(false),
      });
    } else {
      addMutation.mutate(scenarioData, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const isLoading = addMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{scenario ? 'Modifier le scénario' : 'Ajouter un scénario'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Titre</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">Durée</Label>
            <Input id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="players" className="text-right">Joueurs</Label>
            <Input id="players" value={players} onChange={(e) => setPlayers(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select value={type} onValueChange={(value: 'short' | 'long') => setType(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Type de scénario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Court</SelectItem>
                <SelectItem value="long">Long</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rules" className="text-right">Règles</Label>
            <Textarea id="rules" value={rules} onChange={(e) => setRules(e.target.value)} className="col-span-3" placeholder="Séparées par des virgules" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Annuler</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {scenario ? 'Sauvegarder' : 'Ajouter'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScenarioFormDialog;
