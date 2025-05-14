
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from 'lucide-react';
import LocationMap from '../map/LocationMap';
import { calculateDistance } from '@/utils/mapUtils';

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
  const [finalCoordinates, setFinalCoordinates] = useState<[number, number]>([0, 0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifie si les coordonnées sont des valeurs numériques valides
    const validLng = typeof coordinates[0] === 'number' ? coordinates[0] : parseFloat(String(coordinates[0]));
    const validLat = typeof coordinates[1] === 'number' ? coordinates[1] : parseFloat(String(coordinates[1]));

    // Vérifier si les coordonnées sont valides et dans des limites raisonnables (sur la terre)
    const isValidLng = !isNaN(validLng) && validLng >= -180 && validLng <= 180;
    const isValidLat = !isNaN(validLat) && validLat >= -90 && validLat <= 90;
    
    // Si les coordonnées sont valides, on les utilise, sinon on essaie de géocoder l'adresse
    if (isValidLng && isValidLat) {
      // Vérifier si les coordonnées sont au milieu de l'océan (coordonnées proches de 0,0)
      const distanceToEquator = calculateDistance(validLat, validLng, 0, 0);
      if (distanceToEquator < 1000) { // Si les coordonnées sont à moins de 1000km du point 0,0
        geocodeAddress();
      } else {
        setFinalCoordinates([validLng, validLat]);
        setIsLoading(false);
      }
    } else {
      geocodeAddress();
    }
  }, [coordinates, address, zipCode, city]);

  const geocodeAddress = async () => {
    try {
      const fullAddress = encodeURIComponent(`${address}, ${zipCode} ${city}`);
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${fullAddress}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lon, lat } = data[0];
        setFinalCoordinates([parseFloat(lon), parseFloat(lat)]);
      } else {
        // Si aucun résultat, utilisez des coordonnées par défaut pour la France
        setFinalCoordinates([2.3522, 48.8566]); // Paris
      }
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      setFinalCoordinates([2.3522, 48.8566]); // Paris par défaut
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="bg-gray-200 rounded-lg h-[200px] mb-4 overflow-hidden relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-airsoft-red border-t-transparent"></div>
            </div>
          ) : (
            <LocationMap 
              location={`${address}, ${zipCode} ${city}`} 
              coordinates={finalCoordinates} 
            />
          )}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_15px_rgba(0,0,0,0.2)]"></div>
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
