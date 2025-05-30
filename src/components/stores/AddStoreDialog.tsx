
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { MapStore } from '@/hooks/useMapData';
import { useForm } from 'react-hook-form';
import StoreLocationSection from './StoreLocationSection';
import StoreContactSection from './StoreContactSection';
import StoreImageUploadSection from './StoreImageUploadSection';

interface AddStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editStore?: MapStore;
  onSuccess?: () => void;
}

interface StoreFormData {
  name: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
}

const AddStoreDialog: React.FC<AddStoreDialogProps> = ({ 
  open, 
  onOpenChange, 
  editStore,
  onSuccess 
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const form = useForm<StoreFormData>({
    defaultValues: {
      name: '',
      address: '',
      city: '',
      zipCode: '',
      phone: '',
      email: '',
      website: ''
    }
  });

  // Initialize form with edit data
  useEffect(() => {
    if (editStore) {
      form.reset({
        name: editStore.name || '',
        address: editStore.address || '',
        city: editStore.city || '',
        zipCode: editStore.zip_code || '',
        phone: editStore.phone || '',
        email: editStore.email || '',
        website: editStore.website || ''
      });
      
      if (editStore.lat && editStore.lng) {
        setCoordinates([editStore.lat, editStore.lng]);
      }
      
      // Handle existing images - collect all available images
      const existingImages = [
        editStore.image,
        editStore.picture2,
        editStore.picture3,
        editStore.picture4,
        editStore.picture5
      ].filter(Boolean);
      
      if (existingImages.length > 0) {
        setPreview(existingImages);
      }
    } else {
      // Reset form for new store
      form.reset({
        name: '',
        address: '',
        city: '',
        zipCode: '',
        phone: '',
        email: '',
        website: ''
      });
      setImages([]);
      setPreview([]);
      setCoordinates(null);
    }
  }, [editStore, open, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...images, ...files].slice(0, 5);
    setImages(newImages);

    // Create preview URLs for new files
    const newPreviews = [...preview];
    files.forEach(file => {
      if (newPreviews.length < 5) {
        newPreviews.push(URL.createObjectURL(file));
      }
    });
    setPreview(newPreviews);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = preview.filter((_, i) => i !== index);
    setImages(newImages);
    setPreview(newPreviews);
  };

  const handleAddressChange = async () => {
    const { address, city, zipCode } = form.getValues();
    
    if (!address || !city || !zipCode) return;

    setIsGeocoding(true);
    try {
      const fullAddress = `${address}, ${zipCode} ${city}, France`;
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(fullAddress)}`);
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates;
        setCoordinates([lat, lng]);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setIsGeocoding(false);
    }
  };

  const uploadImage = async (file: File, index: number): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `stores/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('stores')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('stores')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error(`Error uploading image ${index + 1}:`, error);
      return null;
    }
  };

  const onSubmit = async (data: StoreFormData) => {
    if (!user) return;

    setLoading(true);
    
    try {
      // Upload all new images
      const imageUrls: (string | null)[] = [];
      
      for (let i = 0; i < Math.min(images.length, 5); i++) {
        if (images[i] instanceof File) {
          const url = await uploadImage(images[i], i);
          imageUrls.push(url);
        }
      }

      // For edit mode, preserve existing images that weren't replaced
      let finalImageUrls: (string | null)[] = [];
      
      if (editStore) {
        const existingImages = [
          editStore.image,
          editStore.picture2,
          editStore.picture3,
          editStore.picture4,
          editStore.picture5
        ];
        
        // Start with existing images
        finalImageUrls = [...existingImages];
        
        // Replace with new uploaded images
        imageUrls.forEach((url, index) => {
          if (url) {
            finalImageUrls[index] = url;
          }
        });
      } else {
        finalImageUrls = imageUrls;
      }

      // Ensure we have exactly 5 slots (fill missing with null)
      while (finalImageUrls.length < 5) {
        finalImageUrls.push(null);
      }

      const storeData = {
        name: data.name,
        address: data.address,
        city: data.city,
        zip_code: data.zipCode,
        phone: data.phone || null,
        email: data.email || null,
        website: data.website || null,
        picture1: finalImageUrls[0] || null,
        picture2: finalImageUrls[1] || null,
        picture3: finalImageUrls[2] || null,
        picture4: finalImageUrls[3] || null,
        picture5: finalImageUrls[4] || null,
        latitude: coordinates?.[0] || 0,
        longitude: coordinates?.[1] || 0,
      };

      let result;
      
      if (editStore) {
        // Mode modification
        result = await supabase
          .from('stores')
          .update(storeData)
          .eq('id', editStore.id);
      } else {
        // Mode création
        result = await supabase
          .from('stores')
          .insert({
            ...storeData,
            created_by: user.id
          });
      }

      if (result.error) throw result.error;

      toast({
        title: editStore ? "Magasin modifié" : "Magasin ajouté",
        description: editStore 
          ? "Le magasin a été modifié avec succès." 
          : "Le magasin a été ajouté avec succès."
      });

      onOpenChange(false);
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: editStore 
          ? "Impossible de modifier le magasin." 
          : "Impossible d'ajouter le magasin.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editStore ? 'Modifier le magasin' : 'Ajouter un nouveau magasin'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du magasin *</FormLabel>
                      <FormControl>
                        <Input {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <StoreLocationSection
                  form={form}
                  isGeocoding={isGeocoding}
                  coordinates={coordinates}
                  handleAddressChange={handleAddressChange}
                />

                <StoreContactSection form={form} />
              </div>

              <div>
                <StoreImageUploadSection
                  images={images}
                  preview={preview}
                  handleImageChange={handleImageChange}
                  removeImage={removeImage}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-airsoft-red hover:bg-red-700"
              >
                {loading 
                  ? (editStore ? 'Modification...' : 'Ajout...') 
                  : (editStore ? 'Modifier' : 'Ajouter')
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStoreDialog;
