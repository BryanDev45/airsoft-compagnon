
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { MapStore } from '@/hooks/useMapData';
import StoreLocationSection from './StoreLocationSection';
import StoreContactSection from './StoreContactSection';
import StoreImageUploadSection from './StoreImageUploadSection';

interface AddStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editStore?: MapStore;
  onSuccess?: () => void;
}

const AddStoreDialog: React.FC<AddStoreDialogProps> = ({ 
  open, 
  onOpenChange, 
  editStore,
  onSuccess 
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    zip_code: '',
    phone: '',
    email: '',
    website: '',
    picture1: '',
    picture2: '',
    picture3: '',
    picture4: '',
    picture5: '',
    latitude: 0,
    longitude: 0
  });

  // Initialiser le formulaire avec les données du magasin à modifier
  useEffect(() => {
    if (editStore) {
      setFormData({
        name: editStore.name || '',
        address: editStore.address || '',
        city: editStore.city || '',
        zip_code: editStore.zip_code || '',
        phone: editStore.phone || '',
        email: editStore.email || '',
        website: editStore.website || '',
        picture1: editStore.image || '',
        picture2: '',
        picture3: '',
        picture4: '',
        picture5: '',
        latitude: editStore.lat || 0,
        longitude: editStore.lng || 0
      });
    } else {
      // Réinitialiser le formulaire pour un nouveau magasin
      setFormData({
        name: '',
        address: '',
        city: '',
        zip_code: '',
        phone: '',
        email: '',
        website: '',
        picture1: '',
        picture2: '',
        picture3: '',
        picture4: '',
        picture5: '',
        latitude: 0,
        longitude: 0
      });
    }
  }, [editStore, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      const storeData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        zip_code: formData.zip_code,
        phone: formData.phone || null,
        email: formData.email || null,
        website: formData.website || null,
        picture1: formData.picture1 || null,
        picture2: formData.picture2 || null,
        picture3: formData.picture3 || null,
        picture4: formData.picture4 || null,
        picture5: formData.picture5 || null,
        latitude: formData.latitude,
        longitude: formData.longitude,
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
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du magasin *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <StoreLocationSection
                formData={formData}
                setFormData={setFormData}
              />

              <StoreContactSection
                formData={formData}
                setFormData={setFormData}
              />
            </div>

            <div>
              <StoreImageUploadSection
                formData={formData}
                setFormData={setFormData}
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
      </DialogContent>
    </Dialog>
  );
};

export default AddStoreDialog;
