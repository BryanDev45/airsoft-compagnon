
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export function useMapLocation(
  searchQuery: string, 
  setSearchCenter: React.Dispatch<React.SetStateAction<[number, number]>> | ((coords: [number, number]) => void)
) {
  const { toast } = useToast();
  const [isSearching, setIsSearching] = useState(false);

  // Effect to handle search query geocoding
  useEffect(() => {
    let isMounted = true;
    
    const searchLocation = async () => {
      if (searchQuery && !isSearching) {
        setIsSearching(true);
        const coords = await geocodeLocation(searchQuery);
        if (coords && isMounted) {
          setSearchCenter(coords);
        }
        if (isMounted) {
          setIsSearching(false);
        }
      }
    };
    
    if (searchQuery) {
      const timerId = setTimeout(() => {
        searchLocation();
      }, 500);
      
      return () => {
        clearTimeout(timerId);
        isMounted = false;
      };
    }
    
    return () => {
      isMounted = false;
    };
  }, [searchQuery, setSearchCenter, isSearching]);

  const geocodeLocation = async (locationName: string) => {
    if (!locationName) return null;
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        return [parseFloat(lon), parseFloat(lat)] as [number, number];
      }
      return null;
    } catch (error) {
      console.error("Error geocoding location:", error);
      return null;
    }
  };

  const getCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setSearchCenter([longitude, latitude]);
      }, (error) => {
        console.error("Erreur de géolocalisation:", error);
        toast({
          title: "Erreur de localisation",
          description: "Impossible d'obtenir votre position actuelle. Veuillez vérifier vos paramètres de localisation.",
          variant: "destructive"
        });
      });
    } else {
      toast({
        title: "Non supporté",
        description: "La géolocalisation n'est pas prise en charge par votre navigateur.",
        variant: "destructive"
      });
    }
  };

  return { getCurrentPosition, geocodeLocation };
}
