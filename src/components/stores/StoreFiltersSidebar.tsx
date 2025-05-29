
import React from 'react';
import { MapPin, Search, Filter, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

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
    <div className="w-full md:w-1/4 bg-gray-50 p-6 border-r border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-airsoft-red" />
        <h2 className="text-xl font-semibold">Filtres de recherche</h2>
      </div>

      <div className="space-y-6">
        {/* Recherche par lieu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lieu
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Nom, ville, adresse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            onClick={getCurrentPosition}
            variant="outline"
            className="w-full mt-2 text-sm"
            size="sm"
          >
            <MapPin className="h-4 w-4 mr-1" />
            Ma position
          </Button>
        </div>

        {/* Pays */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pays
          </label>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les pays" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les pays</SelectItem>
              <SelectItem value="france">France</SelectItem>
              <SelectItem value="belgique">Belgique</SelectItem>
              <SelectItem value="suisse">Suisse</SelectItem>
              <SelectItem value="luxembourg">Luxembourg</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rayon de recherche */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
        <div className="pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
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
