
import React from 'react';
import { Filter, Loader2 } from 'lucide-react';
import { MapStore } from '@/hooks/useMapData';
import LocationSearchFilter from './filters/LocationSearchFilter';
import EventTypeFilter from './filters/EventTypeFilter';
import DepartmentFilter from './filters/DepartmentFilter';
import DateFilter from './filters/DateFilter';
import CountryFilter from './filters/CountryFilter';
import RadiusFilter from './filters/RadiusFilter';

interface FilterState {
  searchQuery: string;
  selectedType: string;
  selectedDepartment: string;
  selectedDate: Date | undefined;
  selectedCountry: string;
  searchRadius: number[];
  searchCenter: [number, number];
}

interface SearchFiltersSidebarProps {
  loading: boolean;
  filteredEventsCount: number;
  stores?: MapStore[];
  filterState: FilterState;
  setSearchQuery: (query: string) => void;
  setSelectedType: (type: string) => void;
  setSelectedDepartment: (dept: string) => void;
  setSelectedCountry: (country: string) => void;
  setSelectedDate: (date: Date | undefined) => void;
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
    <div className="w-full md:w-1/4 bg-gray-800 p-6 border-r border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-airsoft-red" />
        <h2 className="text-xl font-semibold text-white">Filtres de recherche</h2>
      </div>

      <div className="space-y-6">
        <LocationSearchFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          getCurrentPosition={getCurrentPosition}
        />

        <EventTypeFilter
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />

        <DepartmentFilter
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
        />

        <DateFilter
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <CountryFilter
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />

        <RadiusFilter
          searchRadius={searchRadius}
          setSearchRadius={setSearchRadius}
        />

        <div className="pt-4 border-t border-gray-600">
          <div className="text-sm text-gray-300">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Recherche en cours...
              </div>
            ) : (
              <p className="font-medium">{filteredEventsCount} parties trouvées</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFiltersSidebar;
