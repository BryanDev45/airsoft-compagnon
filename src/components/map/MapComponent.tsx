
// Pour corriger le chargement indéfini de la carte, nous modifions ce composant pour qu'il affiche seulement
// le chargement lorsque c'est nécessaire et pour qu'il ne bloque pas le reste de l'interface

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client'; 
import LocationMap from './LocationMap';

const MapComponent = ({ lat, lng }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  
  useEffect(() => {
    // Si on a déjà les coordonnées, on charge directement la carte
    if (lat && lng) {
      setIsLoading(false);
      return;
    }
    
    // Si on est sur une page de détail d'un jeu et qu'on n'a pas les coordonnées,
    // on essaie de les récupérer
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
            setIsLoading(false);
          } else {
            // Si le jeu n'a pas de coordonnées, on arrête le chargement
            setIsLoading(false);
          }
        } catch (e) {
          console.error("Erreur:", e);
          setIsLoading(false);
        }
      } else {
        // Si on n'est pas sur une page de détail de jeu, on arrête le chargement
        setIsLoading(false);
      }
    };
    
    fetchGameLocation();
  }, [lat, lng, id]);
  
  // Si on n'a pas de coordonnées et qu'on ne charge plus, on ne montre rien
  if ((!lat || !lng) && !isLoading) {
    return null;
  }
  
  // Si on est en train de charger, on montre un indicateur de chargement discret
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-sm text-gray-500">Chargement de la carte...</div>
      </div>
    );
  }
  
  // Sinon on affiche la carte
  return <LocationMap lat={lat} lng={lng} />;
};

export default MapComponent;
