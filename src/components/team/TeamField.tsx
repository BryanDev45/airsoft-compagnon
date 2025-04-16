
import React from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LocationMap from '../map/LocationMap';

interface TeamFieldProps {
  field: any | null;
}

const TeamField = ({ field }: TeamFieldProps) => {
  if (!field) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Aucun terrain disponible
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Cette équipe n'a pas encore ajouté d'informations sur son terrain d'entraînement.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{field.name}</CardTitle>
          <CardDescription>{field.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
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
            </div>
            <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
              <LocationMap 
                location={field.address} 
                coordinates={field.coordinates}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamField;
