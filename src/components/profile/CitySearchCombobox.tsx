
import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
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
import { toast } from "@/components/ui/use-toast";

type City = {
  name: string;
  country: string;
  countryCode: string;
  id: number;
  display: string;
};

type CitySearchComboboxProps = {
  onSelect?: (location: string) => void;
  defaultValue?: string;
};

export function CitySearchCombobox({ onSelect, defaultValue = "" }: CitySearchComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [displayValue, setDisplayValue] = React.useState(defaultValue || "");
  const [cities, setCities] = React.useState<City[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (defaultValue) {
      setDisplayValue(defaultValue);
    }
  }, [defaultValue]);

  const searchCities = React.useCallback(async (query: string) => {
    if (query.length < 2) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.api-ninjas.com/v1/city?name=${encodeURIComponent(query)}&limit=15`,
        {
          headers: {
            'X-Api-Key': 'PDbsZnTx8fgGXqEhSQR73w==OlwSPv2fvGnbcx9d'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche des villes');
      }
      
      const data = await response.json();
      const formattedCities = data.map((city: any, index: number) => ({
        name: city.name,
        country: city.country,
        countryCode: city.country,
        id: index,
        display: `${city.name}, ${city.country}`
      }));
      
      setCities(formattedCities);
    } catch (error) {
      console.error('Erreur de l\'API de recherche de villes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les villes. Veuillez réessayer.",
        variant: "destructive"
      });
      setCities([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearchInputChange = (value: string) => {
    setSearchValue(value);
    if (value.length >= 2) {
      searchCities(value);
    }
  };

  const handleSelectCity = (city: City) => {
    const cityValue = `${city.name}, ${city.country}`;
    setDisplayValue(cityValue);
    setOpen(false);
    onSelect?.(cityValue);
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
          {displayValue || "Sélectionnez une ville..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Rechercher une ville..." 
            value={searchValue}
            onValueChange={handleSearchInputChange}
          />
          {isLoading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          )}
          <CommandList>
            <CommandEmpty>
              {searchValue.length < 2 
                ? "Entrez au moins 2 caractères pour rechercher" 
                : "Aucune ville trouvée"
              }
            </CommandEmpty>
            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  key={`${city.name}-${city.id}`}
                  value={city.display}
                  onSelect={() => handleSelectCity(city)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      displayValue === city.display ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {city.name}, {city.country}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
