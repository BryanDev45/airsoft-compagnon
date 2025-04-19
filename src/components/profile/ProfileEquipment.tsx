import React, { useState } from 'react';
import { Plus, Pencil, Upload, List, Zap, Tag, FileText, Trash2, Wrench } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [editingEquipment, setEditingEquipment] = useState<any>(null);
  const [deletingEquipmentId, setDeletingEquipmentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const [newEquipment, setNewEquipment] = useState({
    type: '',
    brand: '',
    power: '',
    description: '',
    image: '/placeholder.svg'
  });
  
  const resetNewEquipment = () => {
    setNewEquipment({
      type: '',
      brand: '',
      power: '',
      description: '',
      image: '/placeholder.svg'
    });
  };
  
  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter un équipement",
        variant: "destructive"
      });
      return;
    }
    
    if (!newEquipment.type) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un type d'équipement",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('equipment')
        .insert({
          ...newEquipment,
          user_id: user.id
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Équipement ajouté",
        description: "Votre nouvel équipement a été ajouté avec succès"
      });
      
      window.location.reload();
      
      setAddingEquipment(false);
      resetNewEquipment();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter l'équipement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditEquipment = (item: any) => {
    setEditingEquipment(item);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingEquipment?.id || !user?.id) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('equipment')
        .update({
          type: editingEquipment.type,
          brand: editingEquipment.brand,
          power: editingEquipment.power,
          description: editingEquipment.description,
          image: editingEquipment.image
        })
        .eq('id', editingEquipment.id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Équipement modifié",
        description: "Votre équipement a été modifié avec succès"
      });
      
      setEditingEquipment(null);
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier l'équipement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEquipment = (id: string) => {
    setDeletingEquipmentId(id);
  };

  const confirmDelete = async () => {
    if (!deletingEquipmentId || !user?.id) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', deletingEquipmentId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Équipement supprimé",
        description: "Votre équipement a été supprimé avec succès"
      });
      
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'équipement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setDeletingEquipmentId(null);
    }
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditEquipment(item)}
                      className="hover:text-blue-700"
                    >
                      <Wrench size={16} className="mr-1" /> Modifier
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteEquipment(item.id)}
                    >
                      <Trash2 size={16} className="mr-1" /> Supprimer
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

      {/* Edit Equipment Dialog */}
      <Dialog open={editingEquipment !== null} onOpenChange={(open) => !open && setEditingEquipment(null)}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Modifier l'équipement</DialogTitle>
            <DialogDescription>
              Mettez à jour les détails de votre équipement.
            </DialogDescription>
          </DialogHeader>

          {editingEquipment && (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <img 
                    src={editingEquipment.image} 
                    alt="Equipment" 
                    className="w-32 h-32 object-cover rounded-lg" 
                  />
                  <Button 
                    size="sm"
                    variant="outline"
                    className="absolute bottom-2 right-2 h-8 w-8 p-0 rounded-full bg-white"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Type d'équipement</Label>
                  <Select defaultValue={editingEquipment.type}>
                    <SelectTrigger id="edit-type">
                      <SelectValue>{editingEquipment.type}</SelectValue>
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
                  <Label htmlFor="edit-power">Puissance (FPS)</Label>
                  <Input id="edit-power" defaultValue={editingEquipment.power} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-brand">Marque</Label>
                  <Input id="edit-brand" defaultValue={editingEquipment.brand} />
                </div>
                
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Input id="edit-description" defaultValue={editingEquipment.description} />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingEquipment(null)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-airsoft-red hover:bg-red-700">
                  Enregistrer
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Equipment Dialog */}
      <AlertDialog 
        open={deletingEquipmentId !== null} 
        onOpenChange={(open) => !open && setDeletingEquipmentId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet équipement ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ProfileEquipment;
