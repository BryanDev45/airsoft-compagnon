
import React, { useState } from 'react';
import { Filter, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { MapStore } from '@/hooks/useMapData';
import LocationSearchFilter from './filters/LocationSearchFilter';
import EventTypeFilter from './filters/EventTypeFilter';
import DepartmentFilter from './filters/DepartmentFilter';
import DateFilter from './filters/DateFilter';
import CountryFilter from './filters/CountryFilter';
import RadiusFilter from './filters/RadiusFilter';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

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

  const isMobile = useIsMobile();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    location: true,
    type: false,
    department: false,
    date: false,
    country: false,
    radius: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const FilterSection = ({ 
    id, 
    title, 
    children,
    defaultOpen = false 
  }: { 
    id: string;
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
  }) => {
    if (!isMobile) {
      return (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-300 mb-2">{title}</h3>
          <div>
            {children}
          </div>
        </div>
      );
    }

    return (
      <Collapsible 
        open={openSections[id] ?? defaultOpen} 
        onOpenChange={() => toggleSection(id)}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
          <span className="text-sm font-medium text-white">{title}</span>
          {openSections[id] ? (
            <ChevronUp className="h-4 w-4 text-gray-300 flex-shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-300 flex-shrink-0" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-3 px-1">
          {children}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className={`
      bg-gray-800 border-r border-gray-700
      ${isMobile ? 'w-full p-4 h-full' : 'w-full p-6'}
    `}>
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-airsoft-red flex-shrink-0" />
        <h2 className={`font-semibold text-white ${isMobile ? 'text-lg' : 'text-xl'}`}>
          Filtres de recherche
        </h2>
      </div>

      <div className={`space-y-${isMobile ? '4' : '6'}`}>
        <FilterSection id="location" title="Localisation" defaultOpen={true}>
          <LocationSearchFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            getCurrentPosition={getCurrentPosition}
          />
        </FilterSection>

        <FilterSection id="type" title="Type de partie">
          <EventTypeFilter
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />
        </FilterSection>

        <FilterSection id="department" title="Département">
          <DepartmentFilter
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
          />
        </FilterSection>

        <FilterSection id="date" title="Date">
          <DateFilter
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </FilterSection>

        <FilterSection id="country" title="Pays">
          <CountryFilter
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
          />
        </FilterSection>

        <FilterSection id="radius" title="Rayon de recherche">
          <RadiusFilter
            searchRadius={searchRadius}
            setSearchRadius={setSearchRadius}
          />
        </FilterSection>

        <div className={`pt-4 border-t border-gray-600 ${isMobile ? 'sticky bottom-0 bg-gray-800 pb-2' : ''}`}>
          <div className="text-sm text-gray-300">
            {loading ? (
              <div className="flex items-center gap-2 justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
                Recherche en cours...
              </div>
            ) : (
              <p className="font-medium text-center">
                {filteredEventsCount} parties trouvées
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFiltersSidebar;
