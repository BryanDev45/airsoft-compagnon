
import React from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LocationSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  getCurrentPosition: () => void;
  showLabel?: boolean;
}

const LocationSearchFilter: React.FC<LocationSearchFilterProps> = ({
  searchQuery,
  setSearchQuery,
  getCurrentPosition,
  showLabel = true
}) => {
  return (
    <div>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Lieu
        </label>
      )}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Ville, département..."
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
  );
};

export default LocationSearchFilter;
