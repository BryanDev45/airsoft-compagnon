
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useMapLocation } from '@/hooks/useMapLocation';
import { useImageUpload } from '@/hooks/useImageUpload';
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// Importation des composants extraits
import StoreImageUploadSection from './StoreImageUploadSection';
import StoreLocationSection from './StoreLocationSection';
import StoreContactSection from './StoreContactSection';

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  address: z.string().min(5, { message: "L'adresse doit être complète" }),
  zipCode: z.string().min(5, { message: "Code postal invalide" }),
  city: z.string().min(2, { message: "La ville est requise" }),
  phone: z.string().optional(),
  email: z.string().email({ message: "Email invalide" }).optional().or(z.literal('')),
  website: z.string().url({ message: "URL invalide" }).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface AddStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddStoreDialog({ open, onOpenChange }: AddStoreDialogProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageConfirmDialog, setShowImageConfirmDialog] = useState(false);
  
  const { images, preview, handleImageChange, removeImage, clearImages } = useImageUpload(5);
  
  const { geocodeLocation } = useMapLocation(searchQuery, (coords) => {
    setCoordinates(coords);
    setIsGeocoding(false);
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      zipCode: "",
      city: "",
      phone: "",
      email: "",
      website: ""
    }
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter un magasin",
        variant: "destructive"
      });
      return;
    }

    if (!coordinates) {
      toast({
        title: "Erreur",
        description: "Impossible de localiser l'adresse. Veuillez vérifier et réessayer",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Insérer d'abord les données du magasin
      const { data: storeData, error: storeError } = await supabase.from('stores').insert({
        name: data.name,
        address: data.address,
        zip_code: data.zipCode,
        city: data.city,
        latitude: coordinates[1],
        longitude: coordinates[0],
        phone: data.phone || null,
        email: data.email || null,
        website: data.website || null,
        created_by: user.id
      }).select('id').single();

      if (storeError) throw storeError;
      
      // Si des images ont été téléchargées, les enregistrer
      if (images.length > 0) {
        const storeId = storeData.id;
        const imageUrls: Record<string, string> = {};
        
        // Télécharger chaque image
        for (let i = 0; i < Math.min(images.length, 5); i++) {
          const image = images[i];
          const fileExt = image.name.split('.').pop();
          const fileName = `${storeId}_${i + 1}_${Date.now()}.${fileExt}`;
          
          // Télécharger l'image dans le bucket Supabase
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('stores')
            .upload(fileName, image, {
              cacheControl: '3600',
              upsert: true
            });
          
          if (uploadError) {
            console.error(`Erreur lors du téléchargement de l'image ${fileName}:`, uploadError);
            continue;
          }
          
          // Obtenir l'URL publique de l'image téléchargée
          const { data: publicUrlData } = supabase.storage
            .from('stores')
            .getPublicUrl(fileName);
          
          if (publicUrlData) {
            imageUrls[`picture${i + 1}`] = publicUrlData.publicUrl;
          }
        }
        
        // Mettre à jour le magasin avec les URLs des images
        if (Object.keys(imageUrls).length > 0) {
          const { error: updateError } = await supabase
            .from('stores')
            .update(imageUrls)
            .eq('id', storeId);
          
          if (updateError) {
            console.error("Erreur lors de la mise à jour des URLs d'images:", updateError);
          }
        }
      }

      toast({
        title: "Succès",
        description: "Le magasin a été ajouté avec succès",
      });

      // Réinitialiser le formulaire et fermer la boîte de dialogue
      form.reset();
      setCoordinates(null);
      clearImages();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'ajout du magasin",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddressChange = async () => {
    const address = form.getValues('address');
    const zipCode = form.getValues('zipCode');
    const city = form.getValues('city');
    
    if (address && zipCode && city) {
      setIsGeocoding(true);
      const fullAddress = `${address}, ${zipCode} ${city}`;
      setSearchQuery(fullAddress);
      
      // Géocodage direct pour une réponse plus rapide
      const coords = await geocodeLocation(fullAddress);
      if (coords) {
        setCoordinates(coords);
      }
      setIsGeocoding(false);
    }
  };
  
  const handleDialogClose = (open: boolean) => {
    if (!open && (form.formState.isDirty || images.length > 0)) {
      setShowImageConfirmDialog(true);
      return;
    }
    
    onOpenChange(open);
  };
  
  const confirmClose = () => {
    form.reset();
    clearImages();
    setShowImageConfirmDialog(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Ajouter un magasin</DialogTitle>
            <DialogDescription>
              Saisissez les informations du magasin. Tous les champs marqués * sont obligatoires.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-grow pr-6" style={{ height: "calc(70vh - 180px)" }}>
            <div className="pr-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du magasin *</FormLabel>
                        <FormControl>
                          <Input placeholder="Airsoft Shop" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <StoreLocationSection 
                      form={form}
                      isGeocoding={isGeocoding}
                      coordinates={coordinates}
                      handleAddressChange={handleAddressChange}
                    />
                  </div>

                  <div className="space-y-4">
                    <StoreContactSection form={form} />
                  </div>
                  
                  <StoreImageUploadSection 
                    images={images}
                    preview={preview}
                    handleImageChange={handleImageChange}
                    removeImage={removeImage}
                  />
                </form>
              </Form>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-4 pt-2 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleDialogClose(false)}
            >
              Annuler
            </Button>
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting || isGeocoding || !coordinates}
              className="bg-airsoft-red hover:bg-red-700 text-white"
            >
              {isSubmitting ? 'Ajout en cours...' : 'Ajouter le magasin'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialogue de confirmation pour quitter sans sauvegarder */}
      <AlertDialog open={showImageConfirmDialog} onOpenChange={setShowImageConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler les modifications ?</AlertDialogTitle>
            <AlertDialogDescription>
              Toutes les informations saisies et images téléchargées seront perdues. Êtes-vous sûr de vouloir quitter ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowImageConfirmDialog(false)}>Continuer la saisie</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClose} className="bg-airsoft-red hover:bg-red-700 text-white">Quitter sans sauvegarder</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
