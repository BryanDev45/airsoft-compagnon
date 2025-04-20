import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Liste simplifiée des grandes villes
const cities = [
  { city: "Paris", country: "France", value: "paris" },
  { city: "Lyon", country: "France", value: "lyon" },
  { city: "Marseille", country: "France", value: "marseille" },
  { city: "Toulouse", country: "France", value: "toulouse" },
  { city: "Nice", country: "France", value: "nice" },
  { city: "Nantes", country: "France", value: "nantes" },
  { city: "Strasbourg", country: "France", value: "strasbourg" },
  { city: "Montpellier", country: "France", value: "montpellier" },
  { city: "Bordeaux", country: "France", value: "bordeaux" },
  { city: "Lille", country: "France", value: "lille" },
  { city: "Rennes", country: "France", value: "rennes" },
  { city: "Reims", country: "France", value: "reims" },
  { city: "Le Havre", country: "France", value: "le-havre" },
  { city: "Saint-Étienne", country: "France", value: "saint-etienne" },
  { city: "Toulon", country: "France", value: "toulon" },
  { city: "Bruxelles", country: "Belgique", value: "bruxelles" },
  { city: "Genève", country: "Suisse", value: "geneve" },
  { city: "Luxembourg", country: "Luxembourg", value: "luxembourg" },
];

type ComboboxDemoProps = {
  onSelect?: (location: string) => void;
  defaultValue?: string;
};

export function ComboboxDemo({ onSelect, defaultValue = "" }: ComboboxDemoProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [displayValue, setDisplayValue] = React.useState("");

  React.useEffect(() => {
    if (!defaultValue) return;

    const [cityNameRaw] = defaultValue.split(",").map(str => str.trim().toLowerCase());
    const matched = cities.find(({ city }) => city.toLowerCase() === cityNameRaw);

    if (matched) {
      setValue(matched.value);
      setDisplayValue(`${matched.city}, ${matched.country}`);
    } else {
      setDisplayValue(defaultValue);
    }
  }, [defaultValue]);

  const handleSelectCity = (selectedValue: string) => {
    const selectedCity = cities.find(c => c.value === selectedValue);
    if (!selectedCity) return;

    setValue(selectedValue);
    setDisplayValue(`${selectedCity.city}, ${selectedCity.country}`);
    setOpen(false);

    onSelect?.(`${selectedCity.city}, ${selectedCity.country}`);
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
          <CommandInput placeholder="Rechercher une ville..." />
          <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
          <CommandGroup>
            {cities.map(({ city, country, value: cityValue }) => (
              <CommandItem
                key={cityValue}
                value={cityValue}
                onSelect={handleSelectCity}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === cityValue ? "opacity-100" : "opacity-0"
                  )}
                />
                {city}, {country}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
