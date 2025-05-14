
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
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
      
      // Use MapBox Geocoding API to get coordinates from address
      const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fullAddress)}.json?access_token=pk.eyJ1IjoibG92YWJsZS1kZXYiLCJhIjoiY2xvM2R5bXRsMGUzeDJsbnJ3YTRvbzltZSJ9.ib8DQKmUzRPBRVdta1inYQ`;
      
      const response = await fetch(geocodingUrl);
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        setValidCoordinates([lng, lat]);
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

  // Initialize map once coordinates are valid
  useEffect(() => {
    if (!mapContainer.current || !validCoordinates[0] || !validCoordinates[1]) return;
    
    // Initialize the map
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1kZXYiLCJhIjoiY2xvM2R5bXRsMGUzeDJsbnJ3YTRvbzltZSJ9.ib8DQKmUzRPBRVdta1inYQ';
    
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: validCoordinates,
        zoom: 14,
      });
      
      // Add controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add marker
      marker.current = new mapboxgl.Marker({ color: '#E53E3E' })
        .setLngLat(validCoordinates)
        .addTo(map.current);
    } else {
      // Update marker and map if coordinates change
      marker.current?.setLngLat(validCoordinates);
      map.current.flyTo({
        center: validCoordinates,
        zoom: 14,
        speed: 1.5
      });
    }
    
    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [validCoordinates]);

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MapPin className="mr-2 text-airsoft-red" size={18} />
          Localisation
        </h3>
        
        <div className="bg-gray-100 rounded-lg overflow-hidden h-[200px] mb-4">
          <div ref={mapContainer} className="w-full h-full" />
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
