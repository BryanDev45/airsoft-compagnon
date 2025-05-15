
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from 'lucide-react';
import { LocationMap } from '@/components/map/LocationMap';

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
  
  // Verify if coordinates are valid (not null, not 0,0 or close to it)
  useEffect(() => {
    // Check if coordinates are close to 0,0 (null island)
    const isCloseToZero = 
      Math.abs(coordinates[0]) < 0.1 && Math.abs(coordinates[1]) < 0.1;
      
    if (isCloseToZero || !coordinates[0] || !coordinates[1]) {
      // If coordinates are invalid, try to geocode the address
      geocodeAddress();
    } else {
      // Use provided coordinates
      setValidCoordinates(coordinates);
    }
  }, [coordinates, address, zipCode, city]);

  const geocodeAddress = async () => {
    try {
      const fullAddress = `${address}, ${zipCode} ${city}`;
      
      // Use OpenStreetMap Nominatim API to geocode the address
      const geocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`;
      
      const response = await fetch(geocodingUrl, {
        headers: {
          'User-Agent': 'AirsoftCommunityApp/1.0'
        }
      });
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lon, lat } = data[0];
        setValidCoordinates([parseFloat(lon), parseFloat(lat)]);
      } else {
        // Fallback to France coordinates if geocoding fails
        setValidCoordinates([2.3522, 48.8566]);
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      // Fallback to France coordinates
      setValidCoordinates([2.3522, 48.8566]);
    }
  };

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
