import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";

interface ProfileEquipmentProps {
  equipment: any[];
  readOnly: boolean;
  equipmentTypes: string[];
  fetchEquipment?: () => void;
}

const ProfileEquipment = ({ equipment, readOnly, equipmentTypes, fetchEquipment }: ProfileEquipmentProps) => {
  const [editingEquipment, setEditingEquipment] = useState<any>(null);

  const deleteEquipment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Équipement supprimé",
        description: "L'équipement a été supprimé avec succès"
      });
      
      if (fetchEquipment) {
        fetchEquipment();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'équipement",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {equipmentTypes.map(type => {
        const items = equipment.filter(item => item.type === type);
        
        if (items.length === 0) return null;
        
        return (
          <div key={type}>
            <h3 className="text-lg font-medium mb-3">{type}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(item => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.brand || 'Équipement'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-center p-4">
                        <span className="block text-sm">Pas d'image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{item.brand || 'Non spécifié'}</h4>
                        {item.power && (
                          <Badge variant="outline" className="mt-1">
                            {item.power}
                          </Badge>
                        )}
                      </div>
                      
                      {!readOnly && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingEquipment(item)}
                            className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer cet équipement ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action est irréversible. Cet équipement sera définitivement supprimé de votre profil.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => deleteEquipment(item.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
      
      {equipment.length === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun équipement ajouté pour le moment.</p>
        </div>
      )}

      {editingEquipment && (
        <ProfileEditEquipmentDialog
          open={!!editingEquipment}
          onOpenChange={() => setEditingEquipment(null)}
          equipment={editingEquipment}
          equipmentTypes={equipmentTypes}
          onSave={fetchEquipment}
        />
      )}
    </div>
  );
};

export default ProfileEquipment;
