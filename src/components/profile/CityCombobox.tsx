
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
        const response = await fetch(
          `https://secure.geonames.org/searchJSON?name_startsWith=${encodeURIComponent(debouncedSearchTerm)}&featureClass=P&maxRows=10&username=airsoftcompagnon&lang=fr`,
          { 
            signal: abortController.signal,
            headers: {
              'Accept': 'application/json'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`Network response error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.geonames && Array.isArray(data.geonames)) {
          const formattedCities = data.geonames.map((city: any) => ({
            name: city.name || '',
            country: city.countryName || '',
            fullName: `${city.name || ''}, ${city.countryName || ''}`
          }));
          setCities(formattedCities);
        } else {
          setCities([]);
          if (data.status?.message) {
            setError(`API Error: ${data.status.message}`);
          } else {
            setError("Format de réponse invalide");
          }
        }
      } catch (error: any) {
        console.error("Error fetching cities:", error);
        setCities([]);
        setError(error.message || "Impossible de récupérer les villes. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
    
    return () => {
      abortController.abort();
    };
  }, [debouncedSearchTerm]);

  // Safely create command items - ensure we're not iterating over undefined
  const renderCommandItems = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span>Recherche en cours...</span>
        </div>
      );
    }
    
    // Extra safeguard: ensure cities is defined and is an array before mapping
    if (!Array.isArray(cities) || cities.length === 0) {
      return null;
    }
    
    return cities.map((city) => (
      <CommandItem
        key={city.fullName}
        value={city.fullName}
        onSelect={(currentValue: string) => {
          const safeValue = currentValue || "";
          setValue(safeValue);
          onSelect(safeValue);
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
    ));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          type="button" // Prevent form submission
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
          <CommandList>
            {error && (
              <div className="px-4 py-2 text-sm text-red-500">
                {error}
              </div>
            )}
            <CommandEmpty>
              {isLoading ? "Chargement..." : "Aucune ville trouvée."}
            </CommandEmpty>
            <CommandGroup>
              {renderCommandItems()}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/**
 * This component is needed to fix the "undefined is not iterable" error
 * by properly handling empty or undefined children
 */
function CommandList({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-h-[200px] overflow-y-auto">
      {children}
    </div>
  );
}
