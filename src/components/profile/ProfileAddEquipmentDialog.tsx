
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Upload, Image as ImageIcon, RefreshCw } from 'lucide-react';

interface ProfileAddEquipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEquipment: (equipment: any) => Promise<boolean>;
  equipmentTypes: string[];
}

const ProfileAddEquipmentDialog = ({ 
  open, 
  onOpenChange, 
  onAddEquipment,
  equipmentTypes 
}: ProfileAddEquipmentDialogProps) => {
  const [type, setType] = useState('');
  const [brand, setBrand] = useState('');
  const [power, setPower] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setType('');
    setBrand('');
    setPower('');
    setDescription('');
    setImagePreview(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

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
      const newEquipment = {
        type,
        brand,
        power,
        description,
        image: imagePreview
      };

      const success = await onAddEquipment(newEquipment);
      if (success) {
        handleClose();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'équipement:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'équipement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un équipement</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle pièce d'équipement à votre collection
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="type">Type d'équipement</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                {equipmentTypes.map(equipType => (
                  <SelectItem key={equipType} value={equipType}>{equipType}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="brand">Marque</Label>
            <Input
              id="brand"
              placeholder="Marque de l'équipement"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="power">Puissance</Label>
            <Input
              id="power"
              placeholder="Ex: 350 FPS"
              value={power}
              onChange={(e) => setPower(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Décrivez votre équipement..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Image</Label>
            <div className="flex flex-col items-center">
              <div className="mb-2 w-full h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Equipment preview" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                )}
              </div>
              
              <div className="flex gap-3 mb-1">
                <Label 
                  htmlFor="equipment-image" 
                  className="flex items-center gap-1 bg-airsoft-red hover:bg-red-700 text-white px-3 py-2 rounded-md cursor-pointer text-sm"
                >
                  <Upload size={16} />
                  Télécharger
                </Label>
                <input 
                  id="equipment-image" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden" 
                />
                
                {imagePreview && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setImagePreview(null)}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw size={16} />
                    Réinitialiser
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button 
            variant="outline" 
            onClick={handleClose} 
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-airsoft-red hover:bg-red-700"
            disabled={loading}
          >
            {loading ? "Enregistrement..." : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileAddEquipmentDialog;
