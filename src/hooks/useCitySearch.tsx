
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { City } from '@/types/city';

export const useCitySearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchCities = async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
        setCities([]);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        let response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(debouncedSearchTerm)}&addressdetails=1&limit=20&class=place`,
          { 
            signal: abortController.signal,
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'AirsoftCommunityApp/1.0'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`Network response error: ${response.status}`);
        }
        
        let data = await response.json();
        let formattedCities: City[] = [];
        
        if (data && Array.isArray(data)) {
          formattedCities = data
            .filter((item: any) => {
              const validTypes = ['city', 'town', 'village', 'hamlet', 'suburb', 'municipality', 'administrative'];
              const validClasses = ['place', 'boundary'];
              
              return (
                validClasses.includes(item.class) ||
                validTypes.includes(item.type) ||
                (item.address && (item.address.city || item.address.town || item.address.village))
              );
            })
            .map((item: any) => {
              let cityName = '';
              if (item.address) {
                cityName = item.address.city || item.address.town || item.address.village || item.address.municipality || '';
              }
              if (!cityName) {
                cityName = item.display_name.split(',')[0] || '';
              }
              
              const country = item.address?.country || item.display_name.split(',').pop()?.trim() || '';
              
              return {
                name: cityName,
                country: country,
                fullName: `${cityName}${country ? ', ' + country : ''}`
              };
            })
            .filter((city: City) => city.name)
            .slice(0, 15);
        }
        
        if (formattedCities.length < 3) {
          const generalResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(debouncedSearchTerm)}&addressdetails=1&limit=15`,
            { 
              signal: abortController.signal,
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'AirsoftCommunityApp/1.0'
              }
            }
          );
          
          if (generalResponse.ok) {
            const generalData = await generalResponse.json();
            
            if (generalData && Array.isArray(generalData)) {
              const additionalCities = generalData
                .filter((item: any) => {
                  return item.address && (
                    item.address.city || 
                    item.address.town || 
                    item.address.village || 
                    item.address.municipality ||
                    item.display_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
                  );
                })
                .map((item: any) => {
                  let cityName = '';
                  if (item.address) {
                    cityName = item.address.city || item.address.town || item.address.village || item.address.municipality || '';
                  }
                  if (!cityName) {
                    cityName = item.display_name.split(',')[0] || '';
                  }
                  
                  const country = item.address?.country || item.display_name.split(',').pop()?.trim() || '';
                  
                  return {
                    name: cityName,
                    country: country,
                    fullName: `${cityName}${country ? ', ' + country : ''}`
                  };
                })
                .filter((city: City) => city.name);
              
              const allCities = [...formattedCities, ...additionalCities];
              const uniqueCities = allCities.reduce((acc: City[], current: City) => {
                const exists = acc.find(city => 
                  city.fullName.toLowerCase() === current.fullName.toLowerCase()
                );
                if (!exists) {
                  acc.push(current);
                }
                return acc;
              }, []);
              
              formattedCities = uniqueCities.slice(0, 15);
            }
          }
        }
        
        setCities(formattedCities);
        
        if (formattedCities.length === 0) {
          setError("Aucune ville trouvée. Essayez avec une orthographe différente.");
        }
        
      } catch (error: any) {
        console.error("Error fetching cities:", error);
        setCities([]);
        if (error.name !== 'AbortError') {
          setError("Impossible de récupérer les villes. Veuillez réessayer plus tard.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
    
    return () => {
      abortController.abort();
    };
  }, [debouncedSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    cities,
    isLoading,
    error
  };
};
