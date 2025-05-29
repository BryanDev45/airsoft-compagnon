import React from 'react';
import { MapPin, Search, Filter, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MapStore } from '@/hooks/useMapData';

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

const departments = [
  { value: "01", label: "01 - Ain" },
  { value: "02", label: "02 - Aisne" },
  { value: "03", label: "03 - Allier" },
  { value: "04", label: "04 - Alpes-de-Haute-Provence" },
  { value: "05", label: "05 - Hautes-Alpes" },
  { value: "06", label: "06 - Alpes-Maritimes" },
  { value: "07", label: "07 - Ardèche" },
  { value: "08", label: "08 - Ardennes" },
  { value: "09", label: "09 - Ariège" },
  { value: "10", label: "10 - Aube" },
  { value: "11", label: "11 - Aude" },
  { value: "12", label: "12 - Aveyron" },
  { value: "13", label: "13 - Bouches-du-Rhône" },
  { value: "14", label: "14 - Calvados" },
  { value: "15", label: "15 - Cantal" },
  { value: "16", label: "16 - Charente" },
  { value: "17", label: "17 - Charente-Maritime" },
  { value: "18", label: "18 - Cher" },
  { value: "19", label: "19 - Corrèze" },
  { value: "21", label: "21 - Côte-d'Or" },
  { value: "22", label: "22 - Côtes-d'Armor" },
  { value: "23", label: "23 - Creuse" },
  { value: "24", label: "24 - Dordogne" },
  { value: "25", label: "25 - Doubs" },
  { value: "26", label: "26 - Drôme" },
  { value: "27", label: "27 - Eure" },
  { value: "28", label: "28 - Eure-et-Loir" },
  { value: "29", label: "29 - Finistère" },
  { value: "30", label: "30 - Gard" },
  { value: "31", label: "31 - Haute-Garonne" },
  { value: "32", label: "32 - Gers" },
  { value: "33", label: "33 - Gironde" },
  { value: "34", label: "34 - Hérault" },
  { value: "35", label: "35 - Ille-et-Vilaine" },
  { value: "36", label: "36 - Indre" },
  { value: "37", label: "37 - Indre-et-Loire" },
  { value: "38", label: "38 - Isère" },
  { value: "39", label: "39 - Jura" },
  { value: "40", label: "40 - Landes" },
  { value: "41", label: "41 - Loir-et-Cher" },
  { value: "42", label: "42 - Loire" },
  { value: "43", label: "43 - Haute-Loire" },
  { value: "44", label: "44 - Loire-Atlantique" },
  { value: "45", label: "45 - Loiret" },
  { value: "46", label: "46 - Lot" },
  { value: "47", label: "47 - Lot-et-Garonne" },
  { value: "48", label: "48 - Lozère" },
  { value: "49", label: "49 - Maine-et-Loire" },
  { value: "50", label: "50 - Manche" },
  { value: "51", label: "51 - Marne" },
  { value: "52", label: "52 - Haute-Marne" },
  { value: "53", label: "53 - Mayenne" },
  { value: "54", label: "54 - Meurthe-et-Moselle" },
  { value: "55", label: "55 - Meuse" },
  { value: "56", label: "56 - Morbihan" },
  { value: "57", label: "57 - Moselle" },
  { value: "58", label: "58 - Nièvre" },
  { value: "59", label: "59 - Nord" },
  { value: "60", label: "60 - Oise" },
  { value: "61", label: "61 - Orne" },
  { value: "62", label: "62 - Pas-de-Calais" },
  { value: "63", label: "63 - Puy-de-Dôme" },
  { value: "64", label: "64 - Pyrénées-Atlantiques" },
  { value: "65", label: "65 - Hautes-Pyrénées" },
  { value: "66", label: "66 - Pyrénées-Orientales" },
  { value: "67", label: "67 - Bas-Rhin" },
  { value: "68", label: "68 - Haut-Rhin" },
  { value: "69", label: "69 - Rhône" },
  { value: "70", label: "70 - Haute-Saône" },
  { value: "71", label: "71 - Saône-et-Loire" },
  { value: "72", label: "72 - Sarthe" },
  { value: "73", label: "73 - Savoie" },
  { value: "74", label: "74 - Haute-Savoie" },
  { value: "75", label: "75 - Paris" },
  { value: "76", label: "76 - Seine-Maritime" },
  { value: "77", label: "77 - Seine-et-Marne" },
  { value: "78", label: "78 - Yvelines" },
  { value: "79", label: "79 - Deux-Sèvres" },
  { value: "80", label: "80 - Somme" },
  { value: "81", label: "81 - Tarn" },
  { value: "82", label: "82 - Tarn-et-Garonne" },
  { value: "83", label: "83 - Var" },
  { value: "84", label: "84 - Vaucluse" },
  { value: "85", label: "85 - Vendée" },
  { value: "86", label: "86 - Vienne" },
  { value: "87", label: "87 - Haute-Vienne" },
  { value: "88", label: "88 - Vosges" },
  { value: "89", label: "89 - Yonne" },
  { value: "90", label: "90 - Territoire de Belfort" },
  { value: "91", label: "91 - Essonne" },
  { value: "92", label: "92 - Hauts-de-Seine" },
  { value: "93", label: "93 - Seine-Saint-Denis" },
  { value: "94", label: "94 - Val-de-Marne" },
  { value: "95", label: "95 - Val-d'Oise" }
];

const SearchFiltersSidebar: React.FC<SearchFiltersSidebarProps> = ({
  loading,
  filteredEventsCount,
  stores = [],
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
              placeholder="Ville, département..."
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

        {/* Type d'événement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="dominicale">Parties dominicales</SelectItem>
              <SelectItem value="operation">Opérations</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Département */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Département
          </label>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les départements" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les départements</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP", { locale: fr })
                ) : (
                  <span>Choisir une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>
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
              <p className="font-medium">{filteredEventsCount} parties trouvées</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFiltersSidebar;
