
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client'; 
import LocationMap from './LocationMap';

interface MapComponentProps {
  lat?: number;
  lng?: number;
  searchCenter?: [number, number];
  searchRadius?: number;
  filteredEvents?: any[];
}

const MapComponent: React.FC<MapComponentProps> = ({ lat, lng, searchCenter, searchRadius, filteredEvents }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [coordinates, setCoordinates] = useState<[number, number] | undefined>(undefined);
  
  useEffect(() => {
    // If we have direct lat/lng props, use them
    if (lat && lng) {
      setCoordinates([lng, lat]);
      setIsLoading(false);
      return;
    }
    
    // If we have search center, use that
    if (searchCenter) {
      setCoordinates(searchCenter);
      setIsLoading(false);
      return;
    }
    
    // If we are on a game detail page and don't have coordinates, try to fetch them
    const fetchGameLocation = async () => {
      if (id) {
        try {
          const { data, error } = await supabase
            .from('games')
            .select('lat, lng')
            .eq('id', id)
            .single();
            
          if (error || !data) {
            console.error("Erreur lors de la récupération des coordonnées:", error);
            setIsLoading(false);
            return;
          }
          
          if (data.lat && data.lng) {
            setCoordinates([data.lng, data.lat]);
          }
          
          setIsLoading(false);
        } catch (e) {
          console.error("Erreur:", e);
          setIsLoading(false);
        }
      } else {
        // If we're not on a game detail page, stop loading
        setIsLoading(false);
      }
    };
    
    fetchGameLocation();
  }, [lat, lng, id, searchCenter]);
  
  // If we have filtered events, we should show them on the map
  // But for simplicity, I'm just showing a basic map here
  
  // If we don't have coordinates and we're not loading, don't show anything
  if (!coordinates && !isLoading) {
    return null;
  }
  
  // If we're loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-sm text-gray-500">Chargement de la carte...</div>
      </div>
    );
  }
  
  // Show the map with the coordinates
  return <LocationMap coordinates={coordinates} />;
};

export default MapComponent;
