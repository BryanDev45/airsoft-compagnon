
import React, { useState } from 'react';
import { Plus, Edit, Upload, List, Zap, Tag, FileText, Pencil, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

interface ProfileEquipmentProps {
  equipment: any[];
  equipmentTypes: string[];
  readOnly?: boolean;
}

const ProfileEquipment = ({
  equipment,
  equipmentTypes,
  readOnly = false
}: ProfileEquipmentProps) => {
  const [addingEquipment, setAddingEquipment] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    setAddingEquipment(false);
    toast({
      title: "Équipement ajouté",
      description: "Votre nouvel équipement a été ajouté avec succès"
    });
  };

  const handleEditEquipment = (id: string) => {
    setEditingId(id);
    toast({
      title: "Modification",
      description: "Mode édition activé pour cet équipement"
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Mon équipement</CardTitle>
          <CardDescription>
            Répliques et matériel
          </CardDescription>
        </div>
        {!readOnly && (
          <Button 
            onClick={() => setAddingEquipment(true)} 
            className="bg-airsoft-red hover:bg-red-700 text-white"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" /> Ajouter
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {addingEquipment && !readOnly ? (
          <div className="border rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-4">Nouvel équipement</h3>
            <form onSubmit={handleAddEquipment} className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <div className="bg-gray-200 w-32 h-32 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                  <Upload className="text-gray-400" size={32} />
                </div>
                <Label htmlFor="photo-upload" className="cursor-pointer text-sm text-airsoft-red">
                  Ajouter une photo
                </Label>
                <input id="photo-upload" type="file" className="hidden" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="flex items-center gap-1">
                    <List size={16} /> Type d'équipement
                  </Label>
                  <Select>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="power" className="flex items-center gap-1">
                    <Zap size={16} /> Puissance (FPS)
                  </Label>
                  <Input id="power" placeholder="Ex: 350 FPS" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brand" className="flex items-center gap-1">
                    <Tag size={16} /> Marque
                  </Label>
                  <Input id="brand" placeholder="Ex: G&G, Tokyo Marui..." />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description" className="flex items-center gap-1">
                    <FileText size={16} /> Description
                  </Label>
                  <Input id="description" placeholder="Décrivez votre équipement..." />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setAddingEquipment(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-airsoft-red hover:bg-red-700">
                  Enregistrer
                </Button>
              </div>
            </form>
          </div>
        ) : equipment.length > 0 ? (
          <div className="space-y-4">
            {equipment.map(item => (
              <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4">
                <div className="flex-shrink-0">
                  <img src={item.image} alt={item.description} className="w-24 h-24 object-cover rounded-lg" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-semibold">{item.type}</h3>
                    <Badge className="bg-airsoft-red">{item.power}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Marque:</span> {item.brand}
                  </p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                {!readOnly && (
                  <div className="flex sm:flex-col gap-2 mt-2 sm:mt-0">
                    <Button variant="outline" size="sm" onClick={() => handleEditEquipment(item.id)}>
                      <Pencil size={16} className="mr-1" /> Modifier
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                      <Trash size={16} className="mr-1" /> Supprimer
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-12 text-gray-500">
            {readOnly ? "Cet utilisateur n'a pas encore ajouté d'équipement." : "Vous n'avez pas encore ajouté d'équipement."}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileEquipment;
