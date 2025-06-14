
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CountryFilterProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

const CountryFilter: React.FC<CountryFilterProps> = ({
  selectedCountry,
  setSelectedCountry
}) => {
  // Liste organisée des pays par continent
  const countries = [
    { value: "all", label: "Tous les pays" },
    
    // Europe
    { value: "France", label: "France" },
    { value: "Allemagne", label: "Allemagne" },
    { value: "Belgique", label: "Belgique" },
    { value: "Suisse", label: "Suisse" },
    { value: "Luxembourg", label: "Luxembourg" },
    { value: "Pays-Bas", label: "Pays-Bas" },
    { value: "Espagne", label: "Espagne" },
    { value: "Italie", label: "Italie" },
    { value: "Portugal", label: "Portugal" },
    { value: "Autriche", label: "Autriche" },
    { value: "République tchèque", label: "République tchèque" },
    { value: "Pologne", label: "Pologne" },
    { value: "Hongrie", label: "Hongrie" },
    { value: "Slovaquie", label: "Slovaquie" },
    { value: "Slovénie", label: "Slovénie" },
    { value: "Croatie", label: "Croatie" },
    { value: "Bosnie-Herzégovine", label: "Bosnie-Herzégovine" },
    { value: "Serbie", label: "Serbie" },
    { value: "Monténégro", label: "Monténégro" },
    { value: "Macédoine du Nord", label: "Macédoine du Nord" },
    { value: "Albanie", label: "Albanie" },
    { value: "Grèce", label: "Grèce" },
    { value: "Bulgarie", label: "Bulgarie" },
    { value: "Roumanie", label: "Roumanie" },
    { value: "Ukraine", label: "Ukraine" },
    { value: "Moldavie", label: "Moldavie" },
    { value: "Biélorussie", label: "Biélorussie" },
    { value: "Lituanie", label: "Lituanie" },
    { value: "Lettonie", label: "Lettonie" },
    { value: "Estonie", label: "Estonie" },
    { value: "Finlande", label: "Finlande" },
    { value: "Suède", label: "Suède" },
    { value: "Norvège", label: "Norvège" },
    { value: "Danemark", label: "Danemark" },
    { value: "Islande", label: "Islande" },
    { value: "Irlande", label: "Irlande" },
    { value: "Royaume-Uni", label: "Royaume-Uni" },
    { value: "Russie", label: "Russie" },
    
    // Amérique du Nord
    { value: "États-Unis", label: "États-Unis" },
    { value: "Canada", label: "Canada" },
    { value: "Mexique", label: "Mexique" },
    
    // Amérique du Sud
    { value: "Brésil", label: "Brésil" },
    { value: "Argentine", label: "Argentine" },
    { value: "Chili", label: "Chili" },
    { value: "Pérou", label: "Pérou" },
    { value: "Colombie", label: "Colombie" },
    { value: "Venezuela", label: "Venezuela" },
    { value: "Équateur", label: "Équateur" },
    { value: "Bolivie", label: "Bolivie" },
    { value: "Paraguay", label: "Paraguay" },
    { value: "Uruguay", label: "Uruguay" },
    { value: "Guyane", label: "Guyane" },
    { value: "Suriname", label: "Suriname" },
    { value: "Guyane française", label: "Guyane française" },
    
    // Asie
    { value: "Chine", label: "Chine" },
    { value: "Japon", label: "Japon" },
    { value: "Corée du Sud", label: "Corée du Sud" },
    { value: "Corée du Nord", label: "Corée du Nord" },
    { value: "Inde", label: "Inde" },
    { value: "Indonésie", label: "Indonésie" },
    { value: "Thaïlande", label: "Thaïlande" },
    { value: "Vietnam", label: "Vietnam" },
    { value: "Philippines", label: "Philippines" },
    { value: "Malaisie", label: "Malaisie" },
    { value: "Singapour", label: "Singapour" },
    { value: "Arabie saoudite", label: "Arabie saoudite" },
    { value: "Iran", label: "Iran" },
    { value: "Irak", label: "Irak" },
    { value: "Turquie", label: "Turquie" },
    { value: "Israël", label: "Israël" },
    { value: "Jordanie", label: "Jordanie" },
    { value: "Liban", label: "Liban" },
    { value: "Syrie", label: "Syrie" },
    
    // Afrique
    { value: "Afrique du Sud", label: "Afrique du Sud" },
    { value: "Égypte", label: "Égypte" },
    { value: "Nigeria", label: "Nigeria" },
    { value: "Kenya", label: "Kenya" },
    { value: "Éthiopie", label: "Éthiopie" },
    { value: "Ghana", label: "Ghana" },
    { value: "Côte d'Ivoire", label: "Côte d'Ivoire" },
    { value: "Maroc", label: "Maroc" },
    { value: "Algérie", label: "Algérie" },
    { value: "Tunisie", label: "Tunisie" },
    { value: "Libye", label: "Libye" },
    { value: "Soudan", label: "Soudan" },
    { value: "Tanzanie", label: "Tanzanie" },
    { value: "Ouganda", label: "Ouganda" },
    
    // Océanie
    { value: "Australie", label: "Australie" },
    { value: "Nouvelle-Zélande", label: "Nouvelle-Zélande" },
    { value: "Papouasie-Nouvelle-Guinée", label: "Papouasie-Nouvelle-Guinée" },
    { value: "Fidji", label: "Fidji" }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Pays
      </label>
      <Select value={selectedCountry} onValueChange={setSelectedCountry}>
        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
          <SelectValue placeholder="Tous les pays" />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 border-gray-600 text-white max-h-60">
          {countries.map((country) => (
            <SelectItem 
              key={country.value} 
              value={country.value} 
              className="text-white hover:bg-gray-600"
            >
              {country.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CountryFilter;
