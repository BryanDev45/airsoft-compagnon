
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

// Simplified list of major French cities for demo purposes
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

export function ComboboxDemo({ onSelect, defaultValue = "" }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [displayValue, setDisplayValue] = React.useState("")

  React.useEffect(() => {
    // Parse default value (e.g., "Paris, France")
    if (defaultValue) {
      const parts = defaultValue.split(',').map(part => part.trim());
      if (parts.length >= 1) {
        const cityName = parts[0];
        const matchedCity = cities.find(city => 
          city.city.toLowerCase() === cityName.toLowerCase()
        );
        
        if (matchedCity) {
          setValue(matchedCity.value);
          setDisplayValue(`${matchedCity.city}, ${matchedCity.country}`);
        } else {
          setDisplayValue(defaultValue);
        }
      }
    }
  }, [defaultValue]);

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
          <CommandGroup className="max-h-60 overflow-y-auto">
            {cities.map((city) => (
              <CommandItem
                key={city.value}
                value={city.value}
                onSelect={(currentValue) => {
                  const selectedCity = cities.find(c => c.value === currentValue);
                  if (selectedCity) {
                    setValue(currentValue);
                    setDisplayValue(`${selectedCity.city}, ${selectedCity.country}`);
                    onSelect(selectedCity);
                  }
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === city.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {city.city}, {city.country}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
