
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { MapStore } from '@/hooks/useMapData';
import { useForm } from 'react-hook-form';
import StoreMainForm from './StoreMainForm';
import StoreImageManager from './StoreImageManager';

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
      setCoordinates(null);
      setImages([]);
      setPreview([]);
    }
  }, [editStore, open, form]);

  const handleImagesChange = (newImages: File[], newPreviews: string[]) => {
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

  const uploadImage = async (file: File): Promise<string | null> => {
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
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const onSubmit = async (data: StoreFormData) => {
    if (!user) return;

    setLoading(true);
    
    try {
      console.log('Starting store submission:', { editStore: !!editStore, data });
      
      // Prepare image URLs array
      let finalImageUrls: (string | null)[] = [];
      
      if (editStore) {
        // Start with existing images
        const existingImages = [
          editStore.image,
          editStore.picture2,
          editStore.picture3,
          editStore.picture4,
          editStore.picture5
        ].filter(Boolean) as string[];
        
        // Add existing images that are still in preview
        for (const previewUrl of preview) {
          if (existingImages.includes(previewUrl)) {
            finalImageUrls.push(previewUrl);
          }
        }
        
        // Upload new images (the ones in images array)
        for (const file of images) {
          if (finalImageUrls.length < 5) {
            const uploadedUrl = await uploadImage(file);
            if (uploadedUrl) {
              finalImageUrls.push(uploadedUrl);
            }
          }
        }
      } else {
        // New store - upload all images
        for (const file of images) {
          if (finalImageUrls.length < 5) {
            const uploadedUrl = await uploadImage(file);
            if (uploadedUrl) {
              finalImageUrls.push(uploadedUrl);
            }
          }
        }
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

      console.log('Store data prepared:', storeData);

      let result;
      
      if (editStore) {
        console.log('Updating store with ID:', editStore.id);
        result = await supabase
          .from('stores')
          .update(storeData)
          .eq('id', editStore.id);
      } else {
        console.log('Creating new store');
        result = await supabase
          .from('stores')
          .insert({
            ...storeData,
            created_by: user.id
          });
      }

      console.log('Supabase result:', result);

      if (result.error) {
        console.error('Supabase error:', result.error);
        throw result.error;
      }

      toast({
        title: editStore ? "Magasin modifié" : "Magasin ajouté",
        description: editStore 
          ? "Le magasin a été modifié avec succès." 
          : "Le magasin a été ajouté avec succès."
      });

      // Close dialog first
      onOpenChange(false);
      
      // Call success callback if provided (this should trigger refetch)
      if (onSuccess) {
        console.log('Calling onSuccess callback');
        onSuccess();
      }
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
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
              <StoreMainForm
                form={form}
                isGeocoding={isGeocoding}
                coordinates={coordinates}
                handleAddressChange={handleAddressChange}
              />

              <StoreImageManager
                editStore={editStore}
                onImagesChange={handleImagesChange}
              />
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
