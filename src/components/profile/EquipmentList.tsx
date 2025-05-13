
import React from 'react';
import { 
  Gun, 
  Shield,
  Battery, 
  Glasses,
  Radio, 
  ShirtFolded, 
  Backpack,
  MoreHorizontal
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Equipment {
  id: string;
  name: string;
  type: string;
  description?: string;
  brand?: string;
  model?: string;
}

interface EquipmentListProps {
  equipment: Equipment[];
  onEditClick?: (equipment: Equipment) => void;
  onDeleteClick?: (equipment: Equipment) => void;
  readonly?: boolean;
}

const EquipmentList: React.FC<EquipmentListProps> = ({ 
  equipment, 
  onEditClick, 
  onDeleteClick,
  readonly = false
}) => {
  // Fonction pour obtenir l'icône en fonction du type d'équipement
  const getEquipmentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'réplique':
      case 'replique':
      case 'replica':
        return <Gun className="h-6 w-6" />;
      case 'protection':
        return <Shield className="h-6 w-6" />;
      case 'batterie':
      case 'battery':
        return <Battery className="h-6 w-6" />;
      case 'optique':
      case 'optics':
        return <Glasses className="h-6 w-6" />;
      case 'radio':
      case 'communication':
        return <Radio className="h-6 w-6" />;
      case 'tenue':
      case 'outfit':
      case 'clothing':
        return <ShirtFolded className="h-6 w-6" />;
      case 'accessoire':
      case 'accessory':
      default:
        return <Backpack className="h-6 w-6" />;
    }
  };

  if (!equipment || equipment.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">
          Aucun équipement enregistré
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {equipment.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="bg-gray-50 flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              {getEquipmentIcon(item.type)}
              <Badge variant="secondary">{item.type}</Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-4">
            <CardTitle className="text-lg mb-2">{item.name}</CardTitle>
            
            {item.brand && item.model && (
              <p className="text-sm text-gray-600 mb-2">
                {item.brand} {item.model}
              </p>
            )}
            
            {item.description && (
              <p className="text-sm text-gray-500 line-clamp-3">
                {item.description}
              </p>
            )}
          </CardContent>
          
          {!readonly && (
            <CardFooter className="flex justify-end gap-2 bg-gray-50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditClick && onEditClick(item)}
              >
                Modifier
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
                onClick={() => onDeleteClick && onDeleteClick(item)}
              >
                Supprimer
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};

export default EquipmentList;
