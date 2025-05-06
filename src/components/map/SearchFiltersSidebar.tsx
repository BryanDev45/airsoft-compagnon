
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from '@/components/ui/badge';
import MapFilters from './MapFilters';
import { FilterState } from '@/hooks/useMapFiltering';

interface SearchFiltersSidebarProps {
  loading: boolean;
  filteredEventsCount: number;
  filterState: FilterState;
  setSearchQuery: (query: string) => void;
  setSelectedType: (type: string) => void;
  setSelectedDepartment: (dept: string) => void;
  setSelectedCountry: (country: string) => void;
  setSelectedDate: (date: string) => void;
  setSearchRadius: (radius: number[]) => void;
  getCurrentPosition: () => void;
}

const SearchFiltersSidebar: React.FC<SearchFiltersSidebarProps> = ({
  loading,
  filteredEventsCount,
  filterState,
  setSearchQuery,
  setSelectedType,
  setSelectedDepartment,
  setSelectedCountry,
  setSelectedDate,
  setSearchRadius,
  getCurrentPosition
}) => {
  const { 
    searchQuery, 
    selectedType, 
    selectedDepartment, 
    selectedDate, 
    selectedCountry,
    searchRadius
  } = filterState;

  return (
    <div className="w-full md:w-1/4 bg-gray-800 p-4 text-white">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Rechercher..." 
            className="pl-10 bg-gray-700 border-none text-white placeholder:text-gray-400" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
          />
        </div>
      </div>
      
      <MapFilters 
        selectedCountry={selectedCountry} 
        setSelectedCountry={setSelectedCountry} 
        selectedDepartment={selectedDepartment} 
        setSelectedDepartment={setSelectedDepartment} 
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate} 
        searchRadius={searchRadius} 
        setSearchRadius={setSearchRadius} 
        getCurrentPosition={getCurrentPosition}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />

      <div className="pt-4">
        <p className="text-sm mb-2">
          {loading ? 'Chargement des parties...' : `${filteredEventsCount} parties trouvées`}
        </p>
        <div className="flex flex-wrap gap-2">
          {searchQuery && <Badge className="bg-airsoft-red hover:bg-red-700" onClick={() => setSearchQuery('')}>
              {searchQuery} ×
            </Badge>}
          {selectedType !== 'all' && <Badge className="bg-airsoft-red hover:bg-red-700" onClick={() => setSelectedType('all')}>
              {selectedType === 'dominicale' ? 'Dominicale' : 'Opération'} ×
            </Badge>}
          {selectedDepartment !== 'all' && <Badge className="bg-airsoft-red hover:bg-red-700" onClick={() => setSelectedDepartment('all')}>
              Dép. {selectedDepartment} ×
            </Badge>}
          {selectedCountry !== 'all' && selectedCountry !== 'france' && <Badge className="bg-airsoft-red hover:bg-red-700" onClick={() => setSelectedCountry('all')}>
              {selectedCountry} ×
            </Badge>}
          {selectedDate && <Badge className="bg-airsoft-red hover:bg-red-700" onClick={() => setSelectedDate('')}>
              {selectedDate} ×
            </Badge>}
        </div>
      </div>
    </div>
  );
};

export default SearchFiltersSidebar;
