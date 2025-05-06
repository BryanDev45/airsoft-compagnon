
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from 'lucide-react';
import LocationMap from '../map/LocationMap';

interface GameLocationCardProps {
  address: string;
  zipCode: string;
  city: string;
  coordinates: [number, number];
}

const GameLocationCard: React.FC<GameLocationCardProps> = ({
  address,
  zipCode,
  city,
  coordinates
}) => {
  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${address}, ${zipCode} ${city}`
      )}`,
      '_blank'
    );
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Localisation</h3>
        <div className="bg-gray-200 rounded-lg h-[200px] mb-4">
          <LocationMap 
            location={`${address}, ${zipCode} ${city}`} 
            coordinates={coordinates} 
          />
        </div>
        <div className="flex items-start gap-2">
          <MapPin size={18} className="text-airsoft-red flex-shrink-0 mt-1" />
          <div>
            <div className="font-medium">{address}</div>
            <div className="text-gray-600 text-sm">{zipCode} {city}</div>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full mt-4" 
          onClick={openGoogleMaps}
        >
          <MapPin size={16} className="mr-2" />
          Obtenir l'itinéraire
        </Button>
      </CardContent>
    </Card>
  );
};

export default GameLocationCard;
