
import React from 'react';
import { MapPin, Search, Filter, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import CountryFilter from '@/components/map/filters/CountryFilter';

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
}

const StoreFiltersSidebar: React.FC<StoreFiltersSidebarProps> = ({
  loading,
  filteredStoresCount,
  filterState,
  setSearchQuery,
  setSelectedCountry,
  setSearchRadius,
  getCurrentPosition
}) => {
  const {
    searchQuery,
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
        {/* Recherche par lieu */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Lieu
          </label>
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
            className="w-full mt-2 text-sm border-gray-600 text-white bg-airsoft-red"
          >
            <MapPin className="h-4 w-4 mr-1" />
            Ma position
          </Button>
        </div>

        {/* Pays - Utilise maintenant le même composant que les filtres de parties */}
        <CountryFilter
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />

        {/* Rayon de recherche */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Rayon de recherche: {searchRadius[0]} km
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
        <div className="pt-4 border-t border-gray-600">
          <div className="text-sm text-gray-300">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Recherche en cours...
              </div>
            ) : (
              <p className="font-medium">{filteredStoresCount} magasins trouvés</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreFiltersSidebar;
