
import React from 'react';
import { Calendar, Navigation } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface MapFiltersProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  searchRadius: number[];
  setSearchRadius: (radius: number[]) => void;
  getCurrentPosition: () => void;
}

const MapFilters: React.FC<MapFiltersProps> = ({
  selectedCountry,
  setSelectedCountry,
  selectedDepartment,
  setSelectedDepartment,
  selectedType,
  setSelectedType,
  selectedDate,
  setSelectedDate,
  searchRadius,
  setSearchRadius,
  getCurrentPosition
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Pays</label>
        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
          <SelectTrigger className="bg-gray-700 border-gray-600">
            <SelectValue placeholder="Tous les pays" />
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
        <label className="block text-sm font-medium mb-1">Département</label>
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="bg-gray-700 border-gray-600">
            <SelectValue placeholder="Tous" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="75">Paris (75)</SelectItem>
            <SelectItem value="69">Rhône (69)</SelectItem>
            <SelectItem value="33">Gironde (33)</SelectItem>
            <SelectItem value="13">Bouches-du-Rhône (13)</SelectItem>
            <SelectItem value="59">Nord (59)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="bg-gray-700 border-gray-600">
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="cqb">CQB</SelectItem>
            <SelectItem value="milsim">Milsim</SelectItem>
            <SelectItem value="woodland">Woodland</SelectItem>
            <SelectItem value="speedsoft">Speedsoft</SelectItem>
            <SelectItem value="tournament">Tournoi</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input type="date" className="pl-10 bg-gray-700 border-gray-600 text-white" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Rayon de recherche: {searchRadius[0]} km {searchRadius[0] === 0 && "(Toutes les parties)"}
        </label>
        <Slider
          defaultValue={[50]}
          max={200}
          min={0}
          step={10}
          className="pt-2"
          value={searchRadius}
          onValueChange={setSearchRadius}
        />
      </div>
      
      <div>
        <Button onClick={getCurrentPosition} className="w-full bg-airsoft-red hover:bg-red-700 text-white flex items-center justify-center gap-2">
          <Navigation size={16} />
          Ma position
        </Button>
      </div>
    </div>
  );
};

export default MapFilters;
