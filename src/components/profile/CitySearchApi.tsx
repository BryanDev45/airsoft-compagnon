
import React, { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface City {
  name: string;
  country: string;
  formatted: string;
}

interface CitySearchApiProps {
  defaultValue?: string;
  onSelect: (location: string) => void;
  placeholder?: string;
}

const CitySearchApi = ({ defaultValue = "", onSelect, placeholder = "Sélectionner une ville..." }: CitySearchApiProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const searchCities = async (query: string) => {
    if (query.length < 3) {
      setCities([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=YOUR_API_KEY&limit=10&language=fr`
      );
      const data = await response.json();
      
      const formattedCities = data.results.map(result => ({
        name: result.components.city || result.components.town || result.components.village || result.components.municipality,
        country: result.components.country,
        formatted: result.formatted
      })).filter(city => city.name);

      setCities(formattedCities);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    searchCities(searchTerm);
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
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Rechercher une ville..."
            value={search}
            onValueChange={handleSearch}
          />
          {loading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
          <CommandEmpty>Aucune ville trouvée</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-auto">
            {cities.map((city, index) => (
              <CommandItem
                key={index}
                value={city.formatted}
                onSelect={(currentValue) => {
                  setValue(currentValue);
                  onSelect(currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === city.formatted ? "opacity-100" : "opacity-0"
                  )}
                />
                {city.formatted}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CitySearchApi;
