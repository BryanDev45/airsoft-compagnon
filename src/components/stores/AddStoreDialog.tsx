
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MapPin, Image, X, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useMapLocation } from '@/hooks/useMapLocation';
import { useImageUpload } from '@/hooks/useImageUpload';

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
            imageUrls[`Picture${i + 1}`] = publicUrlData.publicUrl;
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
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Ajouter un magasin</DialogTitle>
            <DialogDescription>
              Saisissez les informations du magasin. Tous les champs marqués * sont obligatoires.
            </DialogDescription>
          </DialogHeader>

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

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="123 rue des Airsofteurs" 
                          {...field} 
                          onBlur={handleAddressChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code postal *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="75001" 
                            {...field} 
                            onBlur={handleAddressChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Paris" 
                            {...field} 
                            onBlur={handleAddressChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="01 23 45 67 89" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="contact@airsoftshop.fr" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site web</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.airsoftshop.fr" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Section pour télécharger des images */}
              <div className="space-y-2">
                <FormLabel>Photos du magasin (max 5)</FormLabel>
                <div className="flex items-center gap-2">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                      <Image className="h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">Cliquez pour ajouter des photos</p>
                      <p className="text-xs text-gray-400 mt-1">{images.length}/5 images</p>
                    </div>
                    <Input 
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={images.length >= 5}
                    />
                  </label>
                </div>
                
                {/* Prévisualisations des images */}
                {preview.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {preview.map((src, index) => (
                      <div key={index} className="relative rounded-md overflow-hidden h-24 border border-gray-200">
                        <img src={src} className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status de la géolocalisation */}
              <div className="text-sm">
                {isGeocoding ? (
                  <div className="text-amber-600 flex items-center">
                    <span className="animate-spin mr-2">⟳</span> Géolocalisation en cours...
                  </div>
                ) : coordinates ? (
                  <div className="text-green-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" /> Adresse localisée avec succès
                  </div>
                ) : (
                  <div className="text-gray-500">
                    Remplissez l'adresse complète pour la géolocaliser
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => handleDialogClose(false)}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || isGeocoding || !coordinates}
                >
                  {isSubmitting ? 'Ajout en cours...' : 'Ajouter le magasin'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
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
            <AlertDialogAction onClick={confirmClose}>Quitter sans sauvegarder</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
