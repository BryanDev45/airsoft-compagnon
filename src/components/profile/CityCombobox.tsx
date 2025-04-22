
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
        // Use a more reliable and open city search API
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(debouncedSearchTerm)}&type=city&limit=10&apiKey=56b3ef22dedb42e48632bea692e1b27c`
        );
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        if (data && data.features && Array.isArray(data.features)) {
          const formattedCities = data.features.map((city: any) => {
            const properties = city.properties;
            const name = properties.city || properties.name;
            const country = properties.country;
            return {
              name: name || "",
              country: country || "",
              fullName: `${name || ""}, ${country || ""}`
            };
          }).filter((city: City) => city.name && city.country);
          
          setCities(formattedCities);
        } else {
          console.error("Invalid API response:", data);
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
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Recherche en cours...</span>
              </div>
            ) : (
              <>
                <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
                <CommandGroup>
                  {cities.map((city) => (
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
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
