import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Define the type for a scenario item based on the DB schema
export type Scenario = {
  id: string;
  title: string;
  duration: string;
  players: string;
  description: string;
  rules: string[];
  type: 'short' | 'long';
  created_at: string;
};

// Fetch all scenarios
const fetchScenarios = async () => {
  const { data, error } = await supabase
    .from('scenarios')
    .select('*')
    .order('type', { ascending: true })
    .order('title', { ascending: true });

  if (error) throw new Error(error.message);
  return data as Scenario[];
};

export const useScenarios = () => {
  return useQuery<Scenario[], Error>({
    queryKey: ['scenarios'],
    queryFn: fetchScenarios
  });
};

// Add a new scenario
const addScenario = async (newScenario: Omit<Scenario, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('scenarios')
    .insert([newScenario])
    .select()
    .single();
    
  if (error) throw new Error(error.message);
  return data;
};

export const useAddScenario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addScenario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
      toast({ title: "Succès", description: "Scénario ajouté." });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });
};

// Update a scenario
const updateScenario = async (updatedScenario: Partial<Omit<Scenario, 'created_at' | 'type'>> & { id: string, type: string }) => {
    const { id, ...scenarioData } = updatedScenario;
    const { data, error } = await supabase
        .from('scenarios')
        .update(scenarioData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
};

export const useUpdateScenario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateScenario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
      toast({ title: "Succès", description: "Scénario mis à jour." });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });
};


// Delete a scenario
const deleteScenario = async (id: string) => {
    const { error } = await supabase.from('scenarios').delete().eq('id', id);
    if (error) throw new Error(error.message);
};


export const useDeleteScenario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteScenario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
      toast({ title: "Succès", description: "Scénario supprimé." });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });
};
