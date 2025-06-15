
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge as BadgeType } from '@/hooks/badges/useAllBadges';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères."),
  background_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Format de couleur hexadécimal invalide (ex: #RRGGBB)."),
  border_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Format de couleur hexadécimal invalide (ex: #RRGGBB)."),
  iconFile: z.instanceof(File).optional(),
});

interface BadgeFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  badge: BadgeType | null;
  isSaving: boolean;
}

const BadgeFormDialog: React.FC<BadgeFormDialogProps> = ({ isOpen, onOpenChange, onSubmit, badge, isSaving }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      background_color: '#ffffff',
      border_color: '#000000',
    },
  });
  
  const [preview, setPreview] = useState<string | null>(null);
  
  useEffect(() => {
    if (isOpen) {
      if (badge) {
        form.reset({
          name: badge.name,
          description: badge.description,
          background_color: badge.background_color,
          border_color: badge.border_color,
        });
        setPreview(badge.icon);
      } else {
        form.reset({
          name: '',
          description: '',
          background_color: '#ffffff',
          border_color: '#000000',
        });
        setPreview(null);
      }
    }
  }, [badge, isOpen, form]);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('iconFile', file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{badge ? 'Modifier le badge' : 'Créer un nouveau badge'}</DialogTitle>
          <DialogDescription>
            {badge ? "Modifiez les informations du badge." : "Remplissez les informations pour créer un nouveau badge."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du badge" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description du badge" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="background_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Couleur de fond</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} className="p-1 h-10 w-full"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="border_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Couleur de bordure</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} className="p-1 h-10 w-full"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormItem>
              <FormLabel>Icône</FormLabel>
              <FormControl>
                 <Input type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleFileChange} />
              </FormControl>
              <FormMessage />
              {(preview) && <img src={preview} alt="Aperçu de l'icône" className="mt-2 w-24 h-24 object-contain" />}
            </FormItem>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Annuler</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</> : 'Enregistrer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BadgeFormDialog;
