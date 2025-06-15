
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAddGlossaryTerm, useUpdateGlossaryTerm, GlossaryTerm } from '@/hooks/useGlossary';
import { Loader2 } from 'lucide-react';

interface GlossaryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  term: GlossaryTerm | null;
}

const formSchema = z.object({
  term: z.string().min(1, "Le terme est requis."),
  definition: z.string().min(1, "La définition est requise."),
  category: z.string().min(1, "La catégorie est requise."),
});

const GlossaryFormDialog: React.FC<GlossaryFormDialogProps> = ({ open, onOpenChange, term }) => {
  const addMutation = useAddGlossaryTerm();
  const updateMutation = useUpdateGlossaryTerm();
  const isEditing = !!term;
  const isLoading = addMutation.isPending || updateMutation.isPending;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      term: '',
      definition: '',
      category: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (term) {
        form.reset({
          term: term.term,
          definition: term.definition,
          category: term.category,
        });
      } else {
        form.reset({
          term: '',
          definition: '',
          category: '',
        });
      }
    }
  }, [term, open, form]);
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isEditing && term) {
        updateMutation.mutate({ ...values, id: term.id }, {
            onSuccess: () => onOpenChange(false)
        });
    } else {
        addMutation.mutate(values, {
            onSuccess: () => onOpenChange(false)
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifier le terme' : 'Ajouter un terme'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modifiez les informations du terme ci-dessous.' : 'Remplissez les informations du nouveau terme.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="term"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terme</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: AEG" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="definition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Définition</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Définition du terme..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Équipement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Enregistrer' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GlossaryFormDialog;
