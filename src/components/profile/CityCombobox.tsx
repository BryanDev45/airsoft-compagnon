
import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCitySearch } from "@/hooks/useCitySearch";
import { CitySearchResults } from "./CitySearchResults";
import { CityComboboxProps, City } from "@/types/city";

export const ComboboxDemo = React.memo(({ defaultValue = "", onSelect }: CityComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue || "");
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  const { searchTerm, setSearchTerm, cities, isLoading, error } = useCitySearch();

  const handleCitySelect = React.useCallback((selectedCity: City) => {
    console.log('City selected in parent:', selectedCity.fullName);
    setValue(selectedCity.fullName);
    onSelect(selectedCity.fullName);
    setOpen(false);
    setSearchTerm("");
  }, [onSelect, setSearchTerm]);

  const handleInputChange = React.useCallback((value: string) => {
    setSearchTerm(value || "");
  }, [setSearchTerm]);

  // Stabiliser les props du Command
  const commandProps = React.useMemo(() => ({
    shouldFilter: false,
    className: "overflow-hidden rounded-md bg-white"
  }), []);

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
      <PopoverContent className="p-0 w-[300px] z-50 bg-white border" align="start">
        <Command {...commandProps}>
          <CommandInput 
            ref={inputRef}
            placeholder="Rechercher une ville..." 
            value={searchTerm}
            onValueChange={handleInputChange}
            className="h-9"
          />
          <CommandList className="max-h-[200px] overflow-y-auto bg-white">
            <CitySearchResults
              cities={cities}
              isLoading={isLoading}
              error={error}
              searchTerm={searchTerm}
              selectedValue={value}
              onCitySelect={handleCitySelect}
            />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});

ComboboxDemo.displayName = 'ComboboxDemo';
