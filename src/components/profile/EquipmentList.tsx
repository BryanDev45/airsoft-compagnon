import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShieldCheck, Shield, Shirt } from "lucide-react";

interface EquipmentListProps {
  equipment: any[];
}

export const EquipmentList: React.FC<EquipmentListProps> = ({ equipment }) => {
  if (!equipment || equipment.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          Aucun équipement à afficher
        </CardContent>
      </Card>
    );
  }

  const getEquipmentIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'weapon':
      case 'réplique':
        return <Package className="h-5 w-5" />;
      case 'protection':
        return <ShieldCheck className="h-5 w-5" />;
      case 'gear':
      case 'équipement':
        return <Shield className="h-5 w-5" />;
      case 'clothing':
      case 'vêtement':
        return <Shirt className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-4">
      {equipment.slice(0, 3).map((item, index) => (
        <Card key={item.id || index}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="mr-2 p-1.5 bg-muted rounded-md">
                  {getEquipmentIcon(item.type)}
                </div>
                <CardTitle className="text-lg">{item.name}</CardTitle>
              </div>
              <Badge>{item.type}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm">
              {item.brand && (
                <div className="text-muted-foreground">
                  <span className="font-medium">Marque:</span> {item.brand}
                </div>
              )}
              {item.power && (
                <div className="text-muted-foreground">
                  <span className="font-medium">Puissance:</span> {item.power}
                </div>
              )}
              {item.description && (
                <div className="w-full text-muted-foreground mt-1">
                  {item.description}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {equipment.length > 3 && (
        <div className="text-center">
          <a href="#" className="text-sm text-muted-foreground hover:underline">
            Voir tous les équipements ({equipment.length})
          </a>
        </div>
      )}
    </div>
  );
};
