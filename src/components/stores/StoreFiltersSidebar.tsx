
import React from 'react';
import { MapPin, Search, Filter, Map, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';

interface StoreFiltersSidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  isMapView: boolean;
  onViewToggle: (isMap: boolean) => void;
  storeCount: number;
}

const StoreFiltersSidebar: React.FC<StoreFiltersSidebarProps> = ({
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  isMapView,
  onViewToggle,
  storeCount
}) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-airsoft-red" />
        <h2 className="text-xl font-semibold">Filtres</h2>
      </div>

      {/* Recherche */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recherche
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Nom, ville, adresse..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Département */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Département
        </label>
        <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
          <SelectTrigger>
            <SelectValue placeholder="Tous les départements" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les départements</SelectItem>
            <SelectItem value="75">Paris (75)</SelectItem>
            <SelectItem value="69">Rhône (69)</SelectItem>
            <SelectItem value="13">Bouches-du-Rhône (13)</SelectItem>
            <SelectItem value="31">Haute-Garonne (31)</SelectItem>
            <SelectItem value="59">Nord (59)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Toggle vue */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mode d'affichage
        </label>
        <div className="flex gap-2">
          <Toggle 
            pressed={isMapView} 
            onPressedChange={onViewToggle}
            className="flex-1"
          >
            <Map className="h-4 w-4 mr-1" />
            Carte
          </Toggle>
          <Toggle 
            pressed={!isMapView} 
            onPressedChange={(pressed) => onViewToggle(!pressed)}
            className="flex-1"
          >
            <List className="h-4 w-4 mr-1" />
            Liste
          </Toggle>
        </div>
      </div>

      {/* Résultats */}
      <div className="pt-4 border-t">
        <p className="text-sm text-gray-600 font-medium">
          {storeCount} magasin{storeCount > 1 ? 's' : ''} trouvé{storeCount > 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default StoreFiltersSidebar;
