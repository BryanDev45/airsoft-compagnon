
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MapPin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useMapLocation } from '@/hooks/useMapLocation';

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

    try {
      const { error } = await supabase.from('stores').insert({
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
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le magasin a été ajouté avec succès",
      });

      // Réinitialiser le formulaire et fermer la boîte de dialogue
      form.reset();
      setCoordinates(null);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'ajout du magasin",
        variant: "destructive"
      });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isGeocoding || !coordinates}
              >
                Ajouter le magasin
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
