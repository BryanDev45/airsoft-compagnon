
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Upload, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProfileEditEquipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: any;
  equipmentTypes: string[];
  onSave: () => void;
}

const ProfileEditEquipmentDialog = ({ 
  open, 
  onOpenChange, 
  equipment,
  equipmentTypes,
  onSave 
}: ProfileEditEquipmentDialogProps) => {
  const isMobile = useIsMobile();
  const [type, setType] = useState(equipment?.type || '');
  const [name, setName] = useState(equipment?.name || '');
  const [brand, setBrand] = useState(equipment?.brand || '');
  const [power, setPower] = useState(equipment?.power || '');
  const [description, setDescription] = useState(equipment?.description || '');
  const [image, setImage] = useState(equipment?.image || null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(equipment?.image || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (equipment) {
      setType(equipment.type || '');
      setName(equipment.name || '');
      setBrand(equipment.brand || '');
      setPower(equipment.power || '');
      setDescription(equipment.description || '');
      setImage(equipment.image || null);
      setImagePreview(equipment.image || null);
    }
  }, [equipment]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "La taille de l'image ne doit pas dépasser 2MB",
          variant: "destructive"
        });
        return;
      }

      setNewImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!type) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un type d'équipement",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Mettre à jour les données dans la base de données
      const { error } = await supabase
        .from('equipment')
        .update({
          type,
          name,
          brand,
          power,
          description,
          image: imagePreview
        })
        .eq('id', equipment.id);

      if (error) throw error;

      toast({
        title: "Équipement mis à jour",
        description: "Votre équipement a été mis à jour avec succès"
      });

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'équipement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'équipement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type" className="text-sm font-medium">Type d'équipement</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Sélectionnez un type" />
          </SelectTrigger>
          <SelectContent>
            {equipmentTypes.map(equipType => (
              <SelectItem key={equipType} value={equipType}>{equipType}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Nom</Label>
          <Input
            id="name"
            placeholder="Nom de l'équipement"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="brand" className="text-sm font-medium">Marque</Label>
          <Input
            id="brand"
            placeholder="Marque de l'équipement"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="h-12"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="power" className="text-sm font-medium">Puissance</Label>
        <Input
          id="power"
          placeholder="Ex: 350 FPS"
          value={power}
          onChange={(e) => setPower(e.target.value)}
          className="h-12"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
        <Textarea
          id="description"
          placeholder="Décrivez votre équipement..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="resize-none"
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">Image</Label>
        <div className="flex flex-col items-center space-y-3">
          <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Aperçu de l'équipement" 
                className="w-full h-full object-contain"
              />
            ) : (
              <ImageIcon className="h-8 w-8 text-gray-400" />
            )}
          </div>
          
          <div className="flex gap-2 w-full">
            <Label 
              htmlFor="edit-equipment-image" 
              className="flex items-center justify-center gap-2 bg-airsoft-red hover:bg-red-700 text-white px-4 py-3 rounded-md cursor-pointer text-sm flex-1"
            >
              <Upload size={16} />
              Télécharger
            </Label>
            <input 
              id="edit-equipment-image" 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="hidden" 
            />
            
            {imagePreview && (
              <Button 
                variant="outline" 
                size="default" 
                onClick={() => setImagePreview(null)}
                className="flex items-center justify-center gap-2 px-4"
              >
                <RefreshCw size={16} />
                {isMobile ? '' : 'Réinitialiser'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-3 pt-4">
      <Button 
        onClick={handleSave} 
        className="bg-airsoft-red hover:bg-red-700 w-full h-12"
        disabled={loading}
      >
        {loading ? "Enregistrement..." : "Enregistrer les modifications"}
      </Button>
      <Button 
        variant="outline" 
        onClick={() => onOpenChange(false)} 
        disabled={loading}
        className="w-full h-12"
      >
        Annuler
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[95vh]">
          <DrawerHeader className="pb-4">
            <DrawerTitle className="text-xl">Modifier l'équipement</DrawerTitle>
            <DrawerDescription className="text-sm">
              Modifiez les détails de votre équipement
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto px-4">
            {formContent}
          </div>
          <DrawerFooter className="pt-4">
            {footerContent}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-2">
          <DialogTitle className="text-xl">Modifier l'équipement</DialogTitle>
          <DialogDescription className="text-sm">
            Modifiez les détails de votre équipement
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="py-2">
            {formContent}
          </div>
        </div>

        <DialogFooter className="flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              disabled={loading}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSave} 
              className="bg-airsoft-red hover:bg-red-700 w-full sm:w-auto order-1 sm:order-2"
              disabled={loading}
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditEquipmentDialog;
