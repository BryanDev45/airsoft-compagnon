
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Plus, MapPin, Edit, X, Check } from 'lucide-react';
import LocationMap from '../map/LocationMap';
import { supabase } from '@/integrations/supabase/client';
import { useMapLocation } from '@/hooks/useMapLocation';

interface TeamFieldProps {
  field: any;
  isEditing: boolean;
  onEdit: (fieldId: string, updates: any) => void;
  onSave: (fieldId: string, updates: any) => void;
  onCancel: () => void;
  isTeamAdmin?: boolean;
}

const TeamField: React.FC<TeamFieldProps> = ({
  field,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  isTeamAdmin
}) => {
  const [showAddTerrainDialog, setShowAddTerrainDialog] = useState(false);
  const [addressCoordinates, setAddressCoordinates] = useState<[number, number] | null>(null);
  const [editedField, setEditedField] = useState({
    name: field?.name || '',
    address: field?.address || '',
    city: field?.city || '',
    zip_code: field?.zip_code || '',
    description: field?.description || '',
    coordinates: field?.coordinates || [2.3522, 48.8566] // Default Paris coordinates
  });

  const {
    getCurrentPosition
  } = useMapLocation(isEditing ? editedField.address : '', coords => {
    if (coords) {
      setAddressCoordinates(coords);
      setEditedField(prev => ({
        ...prev,
        coordinates: coords
      }));
    }
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedField(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSave = () => {
    const updatedField = {
      ...editedField,
      coordinates: addressCoordinates || editedField.coordinates
    };
    onSave(field?.id, updatedField);
  };

  const handleEditClick = () => {
    onEdit(field?.id, editedField);
  };

  const handleCancelClick = () => {
    onCancel();
  };

  useEffect(() => {
    if (isEditing && editedField.address) {
      const timerId = setTimeout(() => {
        // La géocodification est gérée par le hook
      }, 500);
      return () => clearTimeout(timerId);
    }
  }, [isEditing, editedField.address]);

  useEffect(() => {
    if (field && field.address && (!field.coordinates || !field.coordinates[0] || !field.coordinates[1])) {
      const { geocodeLocation } = useMapLocation('', () => {});
      const initializeCoordinates = async () => {
        const coords = await geocodeLocation(field.address);
        if (coords) {
          setAddressCoordinates(coords);
          setEditedField(prev => ({
            ...prev,
            coordinates: coords
          }));
        }
      };
      initializeCoordinates();
    }
  }, [field]);

  const addTerrainButton = (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-airsoft-red hover:bg-red-700 text-white w-full">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un terrain
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Ajouter un terrain</DialogTitle>
          <DialogDescription>
            Entrez les informations du terrain pour votre équipe
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom
            </Label>
            <Input 
              id="name" 
              name="name" 
              value={editedField.name} 
              className="col-span-3" 
              onChange={handleInputChange} 
              placeholder="Nom du terrain" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Adresse
            </Label>
            <Input 
              id="address" 
              name="address" 
              value={editedField.address} 
              className="col-span-3" 
              onChange={handleInputChange} 
              placeholder="Adresse complète du terrain" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="city" className="text-right">
              Ville
            </Label>
            <Input 
              id="city" 
              name="city" 
              value={editedField.city} 
              className="col-span-3" 
              onChange={handleInputChange} 
              placeholder="Ville" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="zip_code" className="text-right">
              Code postal
            </Label>
            <Input 
              id="zip_code" 
              name="zip_code" 
              value={editedField.zip_code} 
              className="col-span-3" 
              onChange={handleInputChange} 
              placeholder="Code postal" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea 
              id="description" 
              name="description" 
              value={editedField.description} 
              className="col-span-3 min-h-[100px]" 
              onChange={handleInputChange} 
              placeholder="Description des caractéristiques du terrain" 
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowAddTerrainDialog(false)}>Annuler</Button>
          <Button type="submit" onClick={handleSave}>Ajouter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {!field ? (
        <Card className="overflow-hidden border border-gray-200 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center">
                <MapPin className="h-8 w-8 text-airsoft-red" />
              </div>
              <h3 className="text-xl font-semibold">Aucun terrain configuré</h3>
              <p className="text-gray-500 max-w-md">Ajoutez un terrain pour que vos membres puissent trouver facilement où se déroulent vos parties</p>
              {isTeamAdmin && addTerrainButton}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden border border-gray-200 shadow-md">
          <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-airsoft-red" />
              {isEditing ? (
                <Input 
                  id="name" 
                  name="name" 
                  value={editedField.name} 
                  onChange={handleInputChange} 
                  className="text-lg font-semibold" 
                />
              ) : (
                field.name
              )}
            </CardTitle>
            {!isEditing && field.description && (
              <CardDescription className="text-sm text-gray-600">
                {field.description.substring(0, 120)}
                {field.description.length > 120 ? '...' : ''}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Adresse
                  </Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={editedField.address} 
                    onChange={handleInputChange} 
                    className="flex-1" 
                    placeholder="Adresse complète du terrain" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium">
                      Ville
                    </Label>
                    <Input 
                      id="city" 
                      name="city" 
                      value={editedField.city} 
                      onChange={handleInputChange} 
                      placeholder="Ville" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip_code" className="text-sm font-medium">
                      Code postal
                    </Label>
                    <Input 
                      id="zip_code" 
                      name="zip_code" 
                      value={editedField.zip_code} 
                      onChange={handleInputChange} 
                      placeholder="Code postal" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={editedField.description} 
                    onChange={handleInputChange} 
                    className="min-h-[100px]" 
                    placeholder="Description détaillée du terrain" 
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <MapPin size={18} className="text-airsoft-red flex-shrink-0 mt-0.5" />
                  <div className="font-medium text-gray-700">
                    {field.address}
                    {field.city && `, ${field.city}`}
                    {field.zip_code && ` ${field.zip_code}`}
                  </div>
                </div>
              </div>
            )}

            <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200 shadow-inner relative">
              <LocationMap 
                location={field?.address || ''} 
                coordinates={field?.coordinates?.[0] && field?.coordinates?.[1] ? [field.coordinates[0], field.coordinates[1]] : [2.3522, 48.8566]} 
              />
            </div>

            {isEditing ? (
              <div className="flex justify-end space-x-2 pt-3">
                <Button variant="outline" onClick={onCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </Button>
                <Button onClick={() => onSave(field?.id, editedField)}>
                  <Check className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
              </div>
            ) : (
              isTeamAdmin && (
                <Button onClick={() => onEdit(field?.id, editedField)} className="w-full mt-2">
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              )
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamField;
