
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Define the type for a glossary item based on the DB schema
export type GlossaryTerm = {
  id: string;
  term: string;
  definition: string;
  category: string;
  created_at: string;
};

// Fetch all glossary terms
const fetchGlossaryTerms = async () => {
  const { data, error } = await supabase
    .from('glossary')
    .select('*')
    .order('term', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

export const useGlossaryTerms = () => {
  return useQuery<GlossaryTerm[], Error>({
    queryKey: ['glossaryTerms'],
    queryFn: fetchGlossaryTerms
  });
};

// Add a new glossary term
const addGlossaryTerm = async (newTerm: Omit<GlossaryTerm, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('glossary')
    .insert([newTerm])
    .select()
    .single();
    
  if (error) throw new Error(error.message);
  return data;
};

export const useAddGlossaryTerm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addGlossaryTerm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['glossaryTerms'] });
      toast({ title: "Succès", description: "Terme ajouté au glossaire." });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });
};

// Update a glossary term
const updateGlossaryTerm = async (updatedTerm: Omit<GlossaryTerm, 'created_at'>) => {
    const { id, ...termData } = updatedTerm;
    const { data, error } = await supabase
        .from('glossary')
        .update(termData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
};

export const useUpdateGlossaryTerm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGlossaryTerm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['glossaryTerms'] });
      toast({ title: "Succès", description: "Terme mis à jour." });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });
};


// Delete a glossary term
const deleteGlossaryTerm = async (id: string) => {
    const { error } = await supabase.from('glossary').delete().eq('id', id);
    if (error) throw new Error(error.message);
};


export const useDeleteGlossaryTerm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGlossaryTerm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['glossaryTerms'] });
      toast({ title: "Succès", description: "Terme supprimé." });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });
};
