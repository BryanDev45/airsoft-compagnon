
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from 'lucide-react';
import LocationMap from '@/components/map/LocationMap';
import { getValidCoordinates, areCoordinatesValid } from '@/utils/geocodingUtils';

interface GameLocationCardProps {
  address: string;
  zipCode: string;
  city: string;
  coordinates: [number, number]; // [longitude, latitude]
}

const GameLocationCard: React.FC<GameLocationCardProps> = ({
  address,
  zipCode,
  city,
  coordinates
}) => {
  const [validCoordinates, setValidCoordinates] = useState<[number, number]>([0, 0]);
  
  // Verify and set coordinates on component mount and when coordinates change
  useEffect(() => {
    const setCoordinates = async () => {
      // Extraire la latitude et longitude depuis les coordonnées [lng, lat]
      const [lng, lat] = coordinates;
      
      console.log('GameLocationCard: Input coordinates:', coordinates, 'Address:', `${address}, ${zipCode} ${city}`);
      
      if (areCoordinatesValid(lat, lng)) {
        // Use provided coordinates if they are valid
        console.log('GameLocationCard: Using provided coordinates:', [lng, lat]);
        setValidCoordinates([lng, lat]);
      } else {
        // If coordinates are invalid, use geocoding utility
        console.log('GameLocationCard: Invalid coordinates, using geocoding utility...');
        const geocodedCoords = await getValidCoordinates(
          lat,
          lng,
          address,
          zipCode,
          city,
          'France'
        );
        
        // Convertir en format [lng, lat] pour le composant de carte
        const formattedCoords: [number, number] = [geocodedCoords.longitude, geocodedCoords.latitude];
        console.log('GameLocationCard: Geocoded coordinates:', formattedCoords);
        setValidCoordinates(formattedCoords);
      }
    };

    setCoordinates();
  }, [coordinates, address, zipCode, city]);

  const locationString = `${address}, ${zipCode} ${city}`;

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MapPin className="mr-2 text-airsoft-red" size={18} />
          Localisation
        </h3>
        
        <div className="bg-gray-100 rounded-lg overflow-hidden h-[200px] mb-4">
          <LocationMap location={locationString} coordinates={validCoordinates} />
        </div>
        
        <div className="text-sm">
          <p className="font-medium">{address}</p>
          <p>{zipCode} {city}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameLocationCard;
