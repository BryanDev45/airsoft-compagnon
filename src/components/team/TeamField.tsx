
import React, { useState } from 'react';
import { MapPin, Edit, Plus, Save, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import LocationMap from '../map/LocationMap';

interface TeamFieldProps {
  field: any | null;
}

const TeamField = ({ field }: TeamFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editedField, setEditedField] = useState<any>(field || {});
  const [newField, setNewField] = useState({
    name: '',
    description: '',
    address: '',
    coordinates: [2.3522, 48.8566] as [number, number],
    surface: '',
    type: '',
    hasBuildings: false,
    amenities: ['Parking']
  });
  const [newAmenity, setNewAmenity] = useState('');

  const handleEditSave = () => {
    // Simulating API call
    toast({
      title: "Terrain mis à jour",
      description: "Les informations du terrain ont été mises à jour avec succès"
    });
    setIsEditing(false);
  };

  const handleAddField = () => {
    // Simulating API call
    toast({
      title: "Terrain ajouté",
      description: "Le nouveau terrain a été ajouté avec succès"
    });
    setShowAddDialog(false);
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      if (isEditing) {
        setEditedField({
          ...editedField,
          amenities: [...(editedField.amenities || []), newAmenity.trim()]
        });
      } else {
        setNewField({
          ...newField,
          amenities: [...newField.amenities, newAmenity.trim()]
        });
      }
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    if (isEditing) {
      setEditedField({
        ...editedField,
        amenities: editedField.amenities.filter((a: string) => a !== amenity)
      });
    } else {
      setNewField({
        ...newField,
        amenities: newField.amenities.filter((a: string) => a !== amenity)
      });
    }
  };

  // Moved "Add terrain" button outside the conditional rendering to always show it
  const addTerrainButton = (
    <div className="mb-4">
      <Button onClick={() => setShowAddDialog(true)} className="bg-airsoft-red hover:bg-red-700">
        <Plus className="mr-2 h-4 w-4" />
        Ajouter un terrain
      </Button>
    </div>
  );

  if (!field && !isEditing) {
    return (
      <div className="space-y-6">
        {addTerrainButton}
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Aucun terrain disponible
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Cette équipe n'a pas encore ajouté d'informations sur son terrain d'entraînement.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {addTerrainButton}
      
      <Card>
        <CardHeader className="relative">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{isEditing ? <Input 
                value={editedField.name} 
                onChange={(e) => setEditedField({...editedField, name: e.target.value})}
                className="font-bold text-xl"
              /> : field.name}</CardTitle>
              <CardDescription>{isEditing ? <Textarea 
                value={editedField.description} 
                onChange={(e) => setEditedField({...editedField, description: e.target.value})}
                className="mt-2"
              /> : field.description}</CardDescription>
            </div>
            {!isEditing && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setEditedField({...field});
                  setIsEditing(true);
                }}
              >
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input 
                      id="address"
                      value={editedField.address} 
                      onChange={(e) => setEditedField({...editedField, address: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="surface">Surface</Label>
                    <Input 
                      id="surface"
                      value={editedField.surface} 
                      onChange={(e) => setEditedField({...editedField, surface: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Input 
                      id="type"
                      value={editedField.type} 
                      onChange={(e) => setEditedField({...editedField, type: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center space-x-2 py-2">
                    <Checkbox 
                      id="hasBuildings" 
                      checked={editedField.hasBuildings}
                      onCheckedChange={(checked) => 
                        setEditedField({
                          ...editedField, 
                          hasBuildings: checked === true ? true : false
                        })
                      }
                    />
                    <Label htmlFor="hasBuildings">Bâtiments présents</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amenities">Équipements</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editedField.amenities && editedField.amenities.map((amenity: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800 flex items-center">
                          {amenity}
                          <Button 
                            variant="ghost" 
                            className="h-4 w-4 p-0 ml-1" 
                            onClick={() => handleRemoveAmenity(amenity)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input 
                        value={newAmenity}
                        onChange={(e) => setNewAmenity(e.target.value)}
                        placeholder="Ajouter un équipement"
                        className="flex-1"
                      />
                      <Button variant="outline" onClick={handleAddAmenity}>
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Adresse</h4>
                    <p className="text-gray-800">{field.address}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Surface</h4>
                    <p className="text-gray-800">{field.surface}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Type</h4>
                    <p className="text-gray-800">{field.type}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="bg-gray-100 text-gray-800">
                      {field.hasBuildings ? 'Bâtiments' : 'Sans bâtiments'}
                    </Badge>
                    {field.amenities && field.amenities.map((amenity: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="h-64 rounded-lg overflow-hidden border border-gray-200 relative">
              <LocationMap 
                location={isEditing ? editedField.address : field.address} 
                coordinates={isEditing ? editedField.coordinates : field.coordinates}
              />
            </div>
          </div>
        </CardContent>
        {isEditing && (
          <CardFooter className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Annuler
            </Button>
            <Button className="bg-airsoft-red hover:bg-red-700" onClick={handleEditSave}>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </Button>
          </CardFooter>
        )}
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un terrain</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Nom du terrain</Label>
                <Input 
                  id="new-name"
                  value={newField.name} 
                  onChange={(e) => setNewField({...newField, name: e.target.value})}
                  placeholder="Terrain principal"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-description">Description</Label>
                <Textarea 
                  id="new-description"
                  value={newField.description} 
                  onChange={(e) => setNewField({...newField, description: e.target.value})}
                  placeholder="Description du terrain..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-address">Adresse</Label>
                <Input 
                  id="new-address"
                  value={newField.address} 
                  onChange={(e) => setNewField({...newField, address: e.target.value})}
                  placeholder="123 Rue Exemple, Ville"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-surface">Surface</Label>
                <Input 
                  id="new-surface"
                  value={newField.surface} 
                  onChange={(e) => setNewField({...newField, surface: e.target.value})}
                  placeholder="5 hectares"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-type">Type</Label>
                <Input 
                  id="new-type"
                  value={newField.type} 
                  onChange={(e) => setNewField({...newField, type: e.target.value})}
                  placeholder="Forestier, CQB, etc."
                />
              </div>
              
              <div className="flex items-center space-x-2 py-2">
                <Checkbox 
                  id="new-hasBuildings" 
                  checked={newField.hasBuildings}
                  onCheckedChange={(checked) => 
                    setNewField({
                      ...newField, 
                      hasBuildings: checked === true ? true : false
                    })
                  }
                />
                <Label htmlFor="new-hasBuildings">Bâtiments présents</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-amenities">Équipements</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newField.amenities.map((amenity: string, index: number) => (
                    <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800 flex items-center">
                      {amenity}
                      <Button 
                        variant="ghost" 
                        className="h-4 w-4 p-0 ml-1" 
                        onClick={() => handleRemoveAmenity(amenity)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input 
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Ajouter un équipement"
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleAddAmenity}>
                    Ajouter
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>Prévisualisation de la carte</Label>
              <div className="h-64 rounded-lg overflow-hidden border border-gray-200 relative">
                <LocationMap 
                  location={newField.address} 
                  coordinates={newField.coordinates}
                />
              </div>
              <p className="text-xs text-gray-500">
                La carte sera automatiquement mise à jour en fonction de l'adresse que vous saisissez.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddField} className="bg-airsoft-red hover:bg-red-700">
              Ajouter le terrain
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamField;
