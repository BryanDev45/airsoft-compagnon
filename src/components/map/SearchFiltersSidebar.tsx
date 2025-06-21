
import React, { useState } from 'react';
import { Filter, Loader2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { MapStore } from '@/hooks/useMapData';
import LocationSearchFilter from './filters/LocationSearchFilter';
import EventTypeFilter from './filters/EventTypeFilter';
import DepartmentFilter from './filters/DepartmentFilter';
import DateFilter from './filters/DateFilter';
import CountryFilter from './filters/CountryFilter';
import RadiusFilter from './filters/RadiusFilter';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from '@/components/ui/button';

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
  onCloseMobile?: () => void;
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
  getCurrentPosition,
  onCloseMobile
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

  // En mode mobile, affichage simplifié sans sections déployables
  if (isMobile) {
    return (
      <div className="w-full h-full bg-gray-800 flex flex-col">
        {/* Header avec bouton de fermeture */}
        <div className="flex items-center justify-between p-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-airsoft-red flex-shrink-0" />
            <h2 className="text-lg font-semibold text-white">
              Filtres de recherche
            </h2>
          </div>
          {onCloseMobile && (
            <Button
              onClick={onCloseMobile}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Contenu défilable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 pt-0 space-y-6 min-h-full">
            {/* Localisation */}
            <LocationSearchFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              getCurrentPosition={getCurrentPosition}
            />

            {/* Type de partie */}
            <EventTypeFilter
              selectedType={selectedType}
              setSelectedType={setSelectedType}
            />

            {/* Département */}
            <DepartmentFilter
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
            />

            {/* Date */}
            <DateFilter
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            {/* Pays */}
            <CountryFilter
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
            />

            {/* Rayon de recherche */}
            <RadiusFilter
              searchRadius={searchRadius}
              setSearchRadius={setSearchRadius}
            />
          </div>
        </div>

        {/* Footer avec résultats - fixé en bas */}
        <div className="p-4 border-t border-gray-600 bg-gray-800 flex-shrink-0">
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
    );
  }

  // Mode desktop - utilise showLabel=false pour éviter la duplication
  return (
    <div className="bg-gray-800 border-r border-gray-700 w-full p-6">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-airsoft-red flex-shrink-0" />
        <h2 className="font-semibold text-white text-xl">
          Filtres de recherche
        </h2>
      </div>

      <div className="space-y-6">
        <FilterSection id="location" title="Localisation" defaultOpen={true}>
          <LocationSearchFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            getCurrentPosition={getCurrentPosition}
            showLabel={false}
          />
        </FilterSection>

        <FilterSection id="type" title="Type de partie">
          <EventTypeFilter
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            showLabel={false}
          />
        </FilterSection>

        <FilterSection id="department" title="Département">
          <DepartmentFilter
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            showLabel={false}
          />
        </FilterSection>

        <FilterSection id="date" title="Date">
          <DateFilter
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            showLabel={false}
          />
        </FilterSection>

        <FilterSection id="country" title="Pays">
          <CountryFilter
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            showLabel={false}
          />
        </FilterSection>

        <FilterSection id="radius" title="Rayon de recherche">
          <RadiusFilter
            searchRadius={searchRadius}
            setSearchRadius={setSearchRadius}
            showLabel={false}
          />
        </FilterSection>

        <div className="pt-4 border-t border-gray-600">
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
