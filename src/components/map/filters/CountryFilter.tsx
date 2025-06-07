
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
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Pays
      </label>
      <Select value={selectedCountry} onValueChange={setSelectedCountry}>
        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
          <SelectValue placeholder="Tous les pays" />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 border-gray-600">
          <SelectItem value="all">Tous les pays</SelectItem>
          <SelectItem value="France">France</SelectItem>
          <SelectItem value="Belgique">Belgique</SelectItem>
          <SelectItem value="Suisse">Suisse</SelectItem>
          <SelectItem value="Luxembourg">Luxembourg</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CountryFilter;
