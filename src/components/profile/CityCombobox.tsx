
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface City {
  name: string;
  country: string;
  fullName: string;
}

export function ComboboxDemo({
  defaultValue = "",
  onSelect
}: {
  defaultValue?: string;
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  React.useEffect(() => {
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
        // Première tentative avec des filtres plus larges pour les lieux habités
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
          // Filtrer et formater les résultats pour les lieux habités
          formattedCities = data
            .filter((item: any) => {
              // Accepter plus de types de lieux habités
              const validTypes = ['city', 'town', 'village', 'hamlet', 'suburb', 'municipality', 'administrative'];
              const validClasses = ['place', 'boundary'];
              
              return (
                validClasses.includes(item.class) ||
                validTypes.includes(item.type) ||
                (item.address && (item.address.city || item.address.town || item.address.village))
              );
            })
            .map((item: any) => {
              // Extraire le nom de la ville depuis display_name ou address
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
            .filter((city: City) => city.name) // Supprimer les entrées sans nom
            .slice(0, 15);
        }
        
        // Si on a peu de résultats, faire une recherche plus générale
        if (formattedCities.length < 3) {
          console.log('Recherche élargie car peu de résultats trouvés');
          
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
                  // Plus permissif pour la recherche générale
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
              
              // Fusionner et dédupliquer les résultats
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

  const handleCitySelect = (selectedCity: City) => {
    console.log('City selected:', selectedCity.fullName);
    setValue(selectedCity.fullName);
    onSelect(selectedCity.fullName);
    setOpen(false);
    setSearchTerm(""); // Reset search term after selection
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          type="button"
        >
          {value || "Sélectionner une ville..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]" align="start">
        <Command shouldFilter={false} className="overflow-hidden rounded-md">
          <CommandInput 
            placeholder="Rechercher une ville..." 
            value={searchTerm}
            onValueChange={(value) => setSearchTerm(value || "")}
            className="h-9"
          />
          <CommandList className="max-h-[200px] overflow-y-auto">
            {error ? (
              <div className="px-4 py-2 text-sm text-red-500">
                {error}
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Recherche en cours...</span>
              </div>
            ) : cities.length === 0 ? (
              <CommandEmpty>
                {searchTerm.length < 2 
                  ? "Tapez au moins 2 caractères pour rechercher" 
                  : "Aucune ville trouvée."
                }
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {cities.map((city, index) => (
                  <CommandItem
                    key={`${city.fullName}-${index}`}
                    value={city.fullName}
                    onSelect={() => {
                      console.log('CommandItem onSelect triggered for:', city.fullName);
                      handleCitySelect(city);
                    }}
                    className="cursor-pointer hover:bg-accent"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === city.fullName ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{city.fullName}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
