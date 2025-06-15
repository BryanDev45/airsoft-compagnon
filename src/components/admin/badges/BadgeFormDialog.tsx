
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
import { Loader2, X } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères."),
  background_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Format de couleur hexadécimal invalide (ex: #RRGGBB)."),
  border_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Format de couleur hexadécimal invalide (ex: #RRGGBB)."),
  iconFile: z.instanceof(File).optional(),
  lockedIconFile: z.instanceof(File).optional(),
  locked_icon: z.string().nullable().optional(),
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
  const [lockedPreview, setLockedPreview] = useState<string | null>(null);
  
  useEffect(() => {
    if (isOpen) {
      if (badge) {
        form.reset({
          name: badge.name,
          description: badge.description,
          background_color: badge.background_color,
          border_color: badge.border_color,
          locked_icon: badge.locked_icon,
        });
        setPreview(badge.icon);
        setLockedPreview(badge.locked_icon || null);
      } else {
        form.reset({
          name: '',
          description: '',
          background_color: '#ffffff',
          border_color: '#000000',
          iconFile: undefined,
          lockedIconFile: undefined,
          locked_icon: undefined,
        });
        setPreview(null);
        setLockedPreview(null);
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

  const handleLockedFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('lockedIconFile', file);
      setLockedPreview(URL.createObjectURL(file));
    }
  };
  
  const handleRemoveLockedIcon = () => {
    setLockedPreview(null);
    form.setValue('lockedIconFile', undefined);
    form.setValue('locked_icon', null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Icône (Débloqué)</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleFileChange} />
                </FormControl>
                <FormMessage />
                {preview && <img src={preview} alt="Aperçu de l'icône débloquée" className="mt-2 w-24 h-24 object-contain rounded-lg border p-1" />}
              </FormItem>
              <FormItem>
                <FormLabel>Icône (Verrouillé)</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLockedFileChange} />
                </FormControl>
                <FormMessage />
                {lockedPreview ? (
                  <div className="mt-2 flex items-start gap-2">
                    <img src={lockedPreview} alt="Aperçu de l'icône verrouillée" className="w-24 h-24 object-contain rounded-lg border p-1" />
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7 mt-1 text-red-500 hover:text-red-700" onClick={handleRemoveLockedIcon}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Retirer l'icône</span>
                    </Button>
                  </div>
                ) : <div className="mt-2 w-24 h-24 rounded-lg border p-1 flex items-center justify-center bg-gray-50 text-xs text-gray-500">Aucun</div>}
              </FormItem>
            </div>
            
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
