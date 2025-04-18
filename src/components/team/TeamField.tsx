import React, { useState, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, MapPin } from 'lucide-react';
import LocationMap from '../map/LocationMap';
import { supabase } from '@/integrations/supabase/client';

interface TeamFieldProps {
  field: any;
  isEditing: boolean;
  onEdit: (fieldId: string, updates: any) => void;
  onSave: (fieldId: string, updates: any) => void;
  onCancel: () => void;
}

const TeamField: React.FC<TeamFieldProps> = ({ field, isEditing, onEdit, onSave, onCancel }) => {
  const [showAddTerrainDialog, setShowAddTerrainDialog] = useState(false);
  const [editedField, setEditedField] = useState({
    name: field?.name || '',
    address: field?.address || '',
    description: field?.description || '',
    coordinates: field?.coordinates || [2.3522, 48.8566], // Default Paris coordinates
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedField(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSave = () => {
    onSave(field?.id, editedField);
  };

  const handleEditClick = () => {
    onEdit(field?.id, editedField);
  };

  const handleCancelClick = () => {
    onCancel();
  };

  const addTerrainButton = (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-airsoft-red hover:bg-red-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un terrain
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un terrain</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom
            </Label>
            <Input id="name" name="name" value={editedField.name} className="col-span-3" onChange={handleInputChange} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Adresse
            </Label>
            <Input id="address" name="address" value={editedField.address} className="col-span-3" onChange={handleInputChange} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea id="description" name="description" value={editedField.description} className="col-span-3" onChange={handleInputChange} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Ajouter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <Card>
      {!field ? addTerrainButton : (
        <div className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input id="name" value={isEditing ? editedField.name : field?.name} className="col-span-3" readOnly={!isEditing} onChange={isEditing ? handleInputChange : undefined} name="name" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Adresse
              </Label>
              <Input id="address" value={isEditing ? editedField.address : field?.address} className="col-span-3" readOnly={!isEditing} onChange={isEditing ? handleInputChange : undefined} name="address" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea id="description" value={isEditing ? editedField.description : field?.description} className="col-span-3" readOnly={!isEditing} onChange={isEditing ? handleInputChange : undefined} name="description" />
            </div>
          </div>
          <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200 relative">
            <LocationMap 
              location={isEditing ? editedField.address : field?.address} 
              coordinates={isEditing ? editedField.coordinates : field?.coordinates}
            />
          </div>
          {isEditing ? (
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={onCancel}>Annuler</Button>
              <Button onClick={() => onSave(field?.id, editedField)}>Sauvegarder</Button>
            </div>
          ) : (
            <Button onClick={() => onEdit(field?.id, editedField)}>Modifier</Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default TeamField;
