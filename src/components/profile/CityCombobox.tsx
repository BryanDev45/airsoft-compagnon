
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
import { useState, useEffect } from "react";
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
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch cities based on search term
  useEffect(() => {
    const fetchCities = async () => {
      if (debouncedSearchTerm.length < 2) {
        setCities([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.api-ninjas.com/v1/city?name=${encodeURIComponent(debouncedSearchTerm)}&limit=15`,
          {
            headers: {
              'X-Api-Key': 'KucnUMEZjzwS8MpUhXlHOw==EaXPLcgegM2mWEwZ'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        // Vérifier que data est un tableau avant de le mapper
        if (Array.isArray(data)) {
          const formattedCities = data.map((city: any) => ({
            name: city.name,
            country: city.country,
            fullName: `${city.name}, ${city.country}`
          }));
          
          setCities(formattedCities);
        } else {
          console.error("La réponse API n'est pas un tableau:", data);
          setCities([]);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, [debouncedSearchTerm]);

  const handleSelect = (selectedValue: string) => {
    setValue(selectedValue);
    onSelect(selectedValue);
    setOpen(false);
  };

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
          />
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="ml-2">Recherche en cours...</span>
            </div>
          ) : (
            <>
              <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
              <CommandGroup>
                {Array.isArray(cities) && cities.map((city) => (
                  <CommandItem
                    key={city.fullName}
                    value={city.fullName}
                    onSelect={() => handleSelect(city.fullName)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === city.fullName ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {city.fullName}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
