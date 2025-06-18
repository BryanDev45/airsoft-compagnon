import React, { useState } from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
interface CountryFilterProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}
const CountryFilter: React.FC<CountryFilterProps> = ({
  selectedCountry,
  setSelectedCountry
}) => {
  const [open, setOpen] = useState(false);

  // Liste organisée des pays par continent, puis triée alphabétiquement
  const countries = [{
    value: "all",
    label: "Tous les pays"
  },
  // Europe
  {
    value: "Albanie",
    label: "Albanie"
  }, {
    value: "Allemagne",
    label: "Allemagne"
  }, {
    value: "Autriche",
    label: "Autriche"
  }, {
    value: "Belgique",
    label: "Belgique"
  }, {
    value: "Biélorussie",
    label: "Biélorussie"
  }, {
    value: "Bosnie-Herzégovine",
    label: "Bosnie-Herzégovine"
  }, {
    value: "Bulgarie",
    label: "Bulgarie"
  }, {
    value: "Croatie",
    label: "Croatie"
  }, {
    value: "Danemark",
    label: "Danemark"
  }, {
    value: "Espagne",
    label: "Espagne"
  }, {
    value: "Estonie",
    label: "Estonie"
  }, {
    value: "Finlande",
    label: "Finlande"
  }, {
    value: "France",
    label: "France"
  }, {
    value: "Grèce",
    label: "Grèce"
  }, {
    value: "Hongrie",
    label: "Hongrie"
  }, {
    value: "Irlande",
    label: "Irlande"
  }, {
    value: "Islande",
    label: "Islande"
  }, {
    value: "Italie",
    label: "Italie"
  }, {
    value: "Lettonie",
    label: "Lettonie"
  }, {
    value: "Lituanie",
    label: "Lituanie"
  }, {
    value: "Luxembourg",
    label: "Luxembourg"
  }, {
    value: "Macédoine du Nord",
    label: "Macédoine du Nord"
  }, {
    value: "Moldavie",
    label: "Moldavie"
  }, {
    value: "Monténégro",
    label: "Monténégro"
  }, {
    value: "Norvège",
    label: "Norvège"
  }, {
    value: "Pays-Bas",
    label: "Pays-Bas"
  }, {
    value: "Pologne",
    label: "Pologne"
  }, {
    value: "Portugal",
    label: "Portugal"
  }, {
    value: "République tchèque",
    label: "République tchèque"
  }, {
    value: "Roumanie",
    label: "Roumanie"
  }, {
    value: "Royaume-Uni",
    label: "Royaume-Uni"
  }, {
    value: "Russie",
    label: "Russie"
  }, {
    value: "Serbie",
    label: "Serbie"
  }, {
    value: "Slovaquie",
    label: "Slovaquie"
  }, {
    value: "Slovénie",
    label: "Slovénie"
  }, {
    value: "Suède",
    label: "Suède"
  }, {
    value: "Suisse",
    label: "Suisse"
  }, {
    value: "Ukraine",
    label: "Ukraine"
  },
  // Amérique du Nord
  {
    value: "Canada",
    label: "Canada"
  }, {
    value: "États-Unis",
    label: "États-Unis"
  }, {
    value: "Mexique",
    label: "Mexique"
  },
  // Amérique du Sud
  {
    value: "Argentine",
    label: "Argentine"
  }, {
    value: "Bolivie",
    label: "Bolivie"
  }, {
    value: "Brésil",
    label: "Brésil"
  }, {
    value: "Chili",
    label: "Chili"
  }, {
    value: "Colombie",
    label: "Colombie"
  }, {
    value: "Équateur",
    label: "Équateur"
  }, {
    value: "Guyane",
    label: "Guyane"
  }, {
    value: "Guyane française",
    label: "Guyane française"
  }, {
    value: "Paraguay",
    label: "Paraguay"
  }, {
    value: "Pérou",
    label: "Pérou"
  }, {
    value: "Suriname",
    label: "Suriname"
  }, {
    value: "Uruguay",
    label: "Uruguay"
  }, {
    value: "Venezuela",
    label: "Venezuela"
  },
  // Asie
  {
    value: "Arabie saoudite",
    label: "Arabie saoudite"
  }, {
    value: "Chine",
    label: "Chine"
  }, {
    value: "Corée du Nord",
    label: "Corée du Nord"
  }, {
    value: "Corée du Sud",
    label: "Corée du Sud"
  }, {
    value: "Inde",
    label: "Inde"
  }, {
    value: "Indonésie",
    label: "Indonésie"
  }, {
    value: "Irak",
    label: "Irak"
  }, {
    value: "Iran",
    label: "Iran"
  }, {
    value: "Israël",
    label: "Israël"
  }, {
    value: "Japon",
    label: "Japon"
  }, {
    value: "Jordanie",
    label: "Jordanie"
  }, {
    value: "Liban",
    label: "Liban"
  }, {
    value: "Malaisie",
    label: "Malaisie"
  }, {
    value: "Philippines",
    label: "Philippines"
  }, {
    value: "Singapour",
    label: "Singapour"
  }, {
    value: "Syrie",
    label: "Syrie"
  }, {
    value: "Thaïlande",
    label: "Thaïlande"
  }, {
    value: "Turquie",
    label: "Turquie"
  }, {
    value: "Vietnam",
    label: "Vietnam"
  },
  // Afrique
  {
    value: "Afrique du Sud",
    label: "Afrique du Sud"
  }, {
    value: "Algérie",
    label: "Algérie"
  }, {
    value: "Côte d'Ivoire",
    label: "Côte d'Ivoire"
  }, {
    value: "Égypte",
    label: "Égypte"
  }, {
    value: "Éthiopie",
    label: "Éthiopie"
  }, {
    value: "Ghana",
    label: "Ghana"
  }, {
    value: "Kenya",
    label: "Kenya"
  }, {
    value: "Libye",
    label: "Libye"
  }, {
    value: "Maroc",
    label: "Maroc"
  }, {
    value: "Nigeria",
    label: "Nigeria"
  }, {
    value: "Soudan",
    label: "Soudan"
  }, {
    value: "Tanzanie",
    label: "Tanzanie"
  }, {
    value: "Tunisie",
    label: "Tunisie"
  }, {
    value: "Ouganda",
    label: "Ouganda"
  },
  // Océanie
  {
    value: "Australie",
    label: "Australie"
  }, {
    value: "Fidji",
    label: "Fidji"
  }, {
    value: "Nouvelle-Zélande",
    label: "Nouvelle-Zélande"
  }, {
    value: "Papouasie-Nouvelle-Guinée",
    label: "Papouasie-Nouvelle-Guinée"
  }];
  const selectedCountryLabel = countries.find(country => country.value === selectedCountry)?.label || "Tous les pays";
  return <div>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
            {selectedCountryLabel}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-gray-700 border-gray-600 z-50">
          <Command className="bg-gray-700 text-white">
            <CommandInput placeholder="Rechercher un pays..." className="text-white placeholder:text-gray-400 bg-gray-700 border-gray-600" />
            <CommandList className="bg-gray-700">
              <CommandEmpty className="text-white py-6 text-center">Aucun pays trouvé.</CommandEmpty>
              <CommandGroup className="bg-gray-700">
                {countries.map(country => <CommandItem key={country.value} value={country.label} onSelect={() => {
                console.log('Country selected:', country.value, country.label);
                setSelectedCountry(country.value);
                setOpen(false);
              }} className="!text-white hover:!bg-gray-600 aria-selected:!bg-gray-600 !cursor-pointer !bg-gray-700 !border-0 !opacity-100 data-[disabled]:!opacity-100 data-[disabled]:!pointer-events-auto">
                    <Check className={cn("mr-2 h-4 w-4 text-white", selectedCountry === country.value ? "opacity-100" : "opacity-0")} />
                    <span className="text-white">{country.label}</span>
                  </CommandItem>)}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>;
};
export default CountryFilter;