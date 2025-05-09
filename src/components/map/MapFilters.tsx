import React from 'react';
import { Calendar, Navigation } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface MapFiltersProps {
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (value: string) => void;
  selectedDate: string;
  setSelectedDate: (value: string) => void;
  searchRadius: number[];
  setSearchRadius: (value: number[]) => void;
  getCurrentPosition: () => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
}

const MapFilters: React.FC<MapFiltersProps> = ({
  selectedCountry,
  setSelectedCountry,
  selectedDepartment,
  setSelectedDepartment,
  selectedDate,
  setSelectedDate,
  searchRadius,
  setSearchRadius,
  getCurrentPosition,
  selectedType,
  setSelectedType
}) => {
  // Format the date from French format to ISO format for display in the date picker
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    
    // If the date is already in YYYY-MM-DD format, return it
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }
    
    // Otherwise convert from DD/MM/YYYY to YYYY-MM-DD
    const parts = dateString.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    
    return dateString;
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label className="block text-sm mb-2">Type de partie</label>
        <ToggleGroup type="single" value={selectedType} onValueChange={value => value && setSelectedType(value)} className="grid grid-cols-2 gap-2">
          <ToggleGroupItem value="dominicale" className="bg-gray-700 hover:bg-airsoft-red text-white data-[state=on]:bg-airsoft-red">
            Dominicale
          </ToggleGroupItem>
          <ToggleGroupItem value="operation" className="bg-gray-700 hover:bg-airsoft-red text-white data-[state=on]:bg-airsoft-red">
            Opé
          </ToggleGroupItem>
          <ToggleGroupItem value="all" className="bg-gray-700 hover:bg-airsoft-red text-white data-[state=on]:bg-airsoft-red col-span-2">
            Tous les types
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div>
        <label className="block text-sm mb-2">Pays</label>
        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Sélectionner un pays" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les pays</SelectItem>
            <SelectItem value="france">France</SelectItem>
            <SelectItem value="belgique">Belgique</SelectItem>
            <SelectItem value="suisse">Suisse</SelectItem>
            <SelectItem value="allemagne">Allemagne</SelectItem>
            <SelectItem value="espagne">Espagne</SelectItem>
            <SelectItem value="italie">Italie</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm mb-2">Département</label>
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Sélectionner un département" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les départements</SelectItem>
            <SelectItem value="75">Paris (75)</SelectItem>
            <SelectItem value="13">Bouches-du-Rhône (13)</SelectItem>
            <SelectItem value="33">Gironde (33)</SelectItem>
            <SelectItem value="59">Nord (59)</SelectItem>
            <SelectItem value="69">Rhône (69)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm mb-2">Date</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            type="date" 
            className="pl-10 bg-gray-700 border-gray-600 text-white"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm">Rayon de recherche: {searchRadius[0]} km</label>
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs bg-airsoft-red hover:bg-red-700 text-white border-none"
            onClick={getCurrentPosition}
          >
            <Navigation className="w-3 h-3 mr-1" />
            Ma position
          </Button>
        </div>
        <Slider 
          value={searchRadius} 
          onValueChange={setSearchRadius} 
          max={200} 
          step={1}
          className="my-4"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>0 km</span>
          <span>100 km</span>
          <span>200 km</span>
        </div>
      </div>
    </div>
  );
};

export default MapFilters;
