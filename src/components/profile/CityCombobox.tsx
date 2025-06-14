
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

export function ComboboxDemo({ defaultValue = "", onSelect }: CityComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue || "");
  
  const { searchTerm, setSearchTerm, cities, isLoading, error } = useCitySearch();

  const handleCitySelect = (selectedCity: City) => {
    console.log('City selected in parent:', selectedCity.fullName);
    setValue(selectedCity.fullName);
    onSelect(selectedCity.fullName);
    setOpen(false);
    setSearchTerm("");
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
}
