
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Package, Info } from "lucide-react";
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
import ProfileEditEquipmentDialog from "./ProfileEditEquipmentDialog";

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
    <div className="space-y-8">
      {equipmentTypes.map(type => {
        const items = equipment.filter(item => item.type === type);
        
        if (items.length === 0) return null;
        
        return (
          <div key={type} className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center mb-4">
              <Package className="h-5 w-5 text-airsoft-red mr-2" />
              <h3 className="text-lg font-medium">{type}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map(item => (
                <Card key={item.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
                  <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name || item.brand || 'Équipement'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-center p-4 flex flex-col items-center">
                        <Package className="h-10 w-10 mb-2 opacity-30" />
                        <span className="block text-sm">Pas d'image</span>
                      </div>
                    )}
                    
                    {!readOnly && (
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="absolute top-2 right-2 bg-white opacity-80 hover:opacity-100"
                        onClick={() => setEditingEquipment(item)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Éditer
                      </Button>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        {item.name && (
                          <h4 className="font-medium text-lg text-airsoft-red">{item.name}</h4>
                        )}
                        <h5 className="font-medium text-base">{item.brand || 'Non spécifié'}</h5>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.power && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {item.power}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {!readOnly && (
                        <div className="flex gap-2">
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
                      <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-100">
                        <div className="flex items-start">
                          <Info className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
      
      {equipment.length === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
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
