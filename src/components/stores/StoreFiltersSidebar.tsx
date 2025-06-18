
import React, { useState } from 'react';
import { MapPin, Search, Filter, Loader2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import CountryFilter from '@/components/map/filters/CountryFilter';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

interface StoreFilterState {
  searchQuery: string;
  selectedCountry: string;
  searchRadius: number[];
  searchCenter: [number, number];
}

interface StoreFiltersSidebarProps {
  loading: boolean;
  filteredStoresCount: number;
  filterState: StoreFilterState;
  setSearchQuery: (query: string) => void;
  setSelectedCountry: (country: string) => void;
  setSearchRadius: (radius: number[]) => void;
  getCurrentPosition: () => void;
  onCloseMobile?: () => void;
}

const StoreFiltersSidebar: React.FC<StoreFiltersSidebarProps> = ({
  loading,
  filteredStoresCount,
  filterState,
  setSearchQuery,
  setSelectedCountry,
  setSearchRadius,
  getCurrentPosition,
  onCloseMobile
}) => {
  const {
    searchQuery,
    selectedCountry,
    searchRadius
  } = filterState;

  const isMobile = useIsMobile();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    location: true,
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
      <div className="w-full p-4 h-full bg-gray-800">
        {/* Header avec bouton de fermeture */}
        <div className="flex items-center justify-between mb-6">
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

        {/* Filtres directement affichés */}
        <div className="space-y-6">
          {/* Localisation */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Nom, ville, adresse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <Button
              onClick={getCurrentPosition}
              variant="outline"
              size="sm"
              className="w-full text-sm border-gray-600 text-white bg-airsoft-red hover:bg-red-700"
            >
              <MapPin className="h-4 w-4 mr-1" />
              Ma position
            </Button>
          </div>

          {/* Pays */}
          <div>
            <CountryFilter
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
            />
          </div>

          {/* Rayon de recherche */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Rayon: {searchRadius[0]} km
            </label>
            <Slider
              value={searchRadius}
              onValueChange={setSearchRadius}
              max={200}
              min={5}
              step={5}
              className="w-full"
            />
          </div>

          {/* Résultats */}
          <div className="pt-4 border-t border-gray-600 sticky bottom-0 bg-gray-800 pb-2">
            <div className="text-sm text-gray-300">
              {loading ? (
                <div className="flex items-center gap-2 justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Recherche en cours...
                </div>
              ) : (
                <p className="font-medium text-center">
                  {filteredStoresCount} magasins trouvés
                </p>
              )}
            </div>
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
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Nom, ville, adresse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <Button
              onClick={getCurrentPosition}
              variant="outline"
              size="sm"
              className="w-full text-sm border-gray-600 text-white bg-airsoft-red hover:bg-red-700"
            >
              <MapPin className="h-4 w-4 mr-1" />
              Ma position
            </Button>
          </div>
        </FilterSection>

        <FilterSection id="country" title="Pays">
          <CountryFilter
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            showLabel={false}
          />
        </FilterSection>

        <FilterSection id="radius" title="Rayon de recherche">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Rayon: {searchRadius[0]} km
            </label>
            <Slider
              value={searchRadius}
              onValueChange={setSearchRadius}
              max={200}
              min={5}
              step={5}
              className="w-full"
            />
          </div>
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
                {filteredStoresCount} magasins trouvés
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreFiltersSidebar;
