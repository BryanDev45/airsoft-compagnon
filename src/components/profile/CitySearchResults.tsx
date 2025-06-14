
import React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { City } from '@/types/city';

interface CitySearchResultsProps {
  cities: City[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  selectedValue: string;
  onCitySelect: (city: City) => void;
}

export const CitySearchResults = ({
  cities,
  isLoading,
  error,
  searchTerm,
  selectedValue,
  onCitySelect
}: CitySearchResultsProps) => {
  if (error) {
    return (
      <div className="px-4 py-2 text-sm text-red-500">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span>Recherche en cours...</span>
      </div>
    );
  }

  if (cities.length === 0) {
    return (
      <CommandEmpty>
        {searchTerm.length < 2 
          ? "Tapez au moins 2 caractères pour rechercher" 
          : "Aucune ville trouvée."
        }
      </CommandEmpty>
    );
  }

  const handleCityClick = (city: City, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('City selected via click:', city.fullName);
    onCitySelect(city);
  };

  const handleCitySelect = (city: City) => {
    console.log('City selected via onSelect:', city.fullName);
    onCitySelect(city);
  };

  return (
    <CommandGroup>
      {cities.map((city, index) => (
        <CommandItem
          key={`${city.fullName}-${index}`}
          value={city.fullName}
          className="!cursor-pointer hover:!bg-accent !text-foreground !opacity-100 data-[disabled]:!opacity-100 data-[disabled]:!pointer-events-auto aria-selected:!bg-accent"
          onSelect={() => handleCitySelect(city)}
          onMouseDown={(e) => handleCityClick(city, e)}
          onClick={(e) => handleCityClick(city, e)}
        >
          <Check
            className={cn(
              "mr-2 h-4 w-4",
              selectedValue === city.fullName ? "opacity-100" : "opacity-0"
            )}
          />
          <span className="truncate">{city.fullName}</span>
        </CommandItem>
      ))}
    </CommandGroup>
  );
};
