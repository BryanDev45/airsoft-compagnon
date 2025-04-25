
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
  const [value, setValue] = React.useState(defaultValue);
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  React.useEffect(() => {
    // Create an abort controller to cancel fetch requests if component unmounts
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
        // Add error handling and fallbacks for the GeoNames API request
        const response = await fetch(
          `https://secure.geonames.org/searchJSON?name_startsWith=${encodeURIComponent(debouncedSearchTerm)}&featureClass=P&maxRows=10&username=airsoftcompagnon&lang=fr`,
          { 
            signal: AbortSignal.timeout(5000), // Add timeout to prevent hanging requests
            headers: {
              'Accept': 'application/json'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`Network response error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // More robust verification of API response
        if (data && data.geonames && Array.isArray(data.geonames)) {
          const formattedCities = data.geonames.map((city: any) => ({
            name: city.name || '',
            country: city.countryName || '',
            fullName: `${city.name || ''}, ${city.countryName || ''}`
          }));
          setCities(formattedCities);
        } else {
          console.error("Invalid response format:", data);
          setCities([]);
          // Only set error if there's an actual problem with the data structure
          if (data.status && data.status.message) {
            setError(`API Error: ${data.status.message}`);
          } else {
            setError("Format de réponse invalide");
          }
        }
      } catch (error: any) {
        console.error("Error fetching cities:", error);
        setCities([]);
        setError("Impossible de récupérer les villes. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
    
    // Clean up function to abort any in-flight requests when component unmounts
    return () => {
      abortController.abort();
    };
  }, [debouncedSearchTerm]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Sélectionner une ville..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]">
        <Command>
          <CommandInput 
            placeholder="Rechercher une ville..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="h-9"
          />
          {error && (
            <div className="px-4 py-2 text-sm text-red-500">
              {error}
            </div>
          )}
          <CommandEmpty>
            {isLoading ? "" : "Aucune ville trouvée."}
          </CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Recherche en cours...</span>
              </div>
            ) : (
              Array.isArray(cities) && cities.length > 0 ? 
                cities.map((city) => (
                  <CommandItem
                    key={city.fullName}
                    value={city.fullName}
                    onSelect={() => {
                      setValue(city.fullName);
                      onSelect(city.fullName);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === city.fullName ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {city.fullName}
                  </CommandItem>
                )) : null
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
