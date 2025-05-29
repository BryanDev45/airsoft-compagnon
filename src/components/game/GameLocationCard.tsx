
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from 'lucide-react';
import LocationMap from '@/components/map/LocationMap';

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
  
  // Function to check if coordinates are valid
  const areCoordinatesValid = (coords: [number, number]): boolean => {
    const [lng, lat] = coords;
    
    // Check if coordinates exist and are not null
    if (!lng || !lat || isNaN(lng) || isNaN(lat)) return false;
    
    // Check if coordinates are close to 0,0 (null island)
    const isCloseToZero = Math.abs(lng) < 0.1 && Math.abs(lat) < 0.1;
    
    // Check if coordinates are in a reasonable range for France/Europe
    const isInReasonableRange = lat >= 40 && lat <= 55 && lng >= -5 && lng <= 10;
    
    return !isCloseToZero && isInReasonableRange;
  };

  // Function to geocode address
  const geocodeAddress = async (): Promise<[number, number]> => {
    try {
      const fullAddress = `${address}, ${zipCode} ${city}, France`;
      console.log('GameLocationCard: Geocoding address:', fullAddress);
      
      // Use OpenStreetMap Nominatim API to geocode the address
      const geocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`;
      
      const response = await fetch(geocodingUrl, {
        headers: {
          'User-Agent': 'AirsoftCommunityApp/1.0'
        }
      });
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lon, lat } = data[0];
        const geocodedCoords: [number, number] = [parseFloat(lon), parseFloat(lat)];
        console.log('GameLocationCard: Geocoding successful:', geocodedCoords);
        return geocodedCoords;
      } else {
        console.log('GameLocationCard: No geocoding results found');
        // Fallback to France coordinates if geocoding fails
        return [2.3522, 48.8566];
      }
    } catch (error) {
      console.error("GameLocationCard: Error geocoding address:", error);
      // Fallback to France coordinates
      return [2.3522, 48.8566];
    }
  };
  
  // Verify and set coordinates on component mount and when coordinates change
  useEffect(() => {
    const setCoordinates = async () => {
      if (areCoordinatesValid(coordinates)) {
        // Use provided coordinates if they are valid
        console.log('GameLocationCard: Using provided coordinates:', coordinates);
        setValidCoordinates(coordinates);
      } else {
        // If coordinates are invalid, try to geocode the address
        console.log('GameLocationCard: Invalid coordinates, geocoding address...');
        const geocodedCoords = await geocodeAddress();
        setValidCoordinates(geocodedCoords);
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
