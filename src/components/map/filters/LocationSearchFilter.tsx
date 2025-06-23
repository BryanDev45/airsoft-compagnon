
import React, { useRef, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LocationSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  getCurrentPosition: () => void;
  showLabel?: boolean;
}

const LocationSearchFilter: React.FC<LocationSearchFilterProps> = React.memo(({
  searchQuery,
  setSearchQuery,
  getCurrentPosition,
  showLabel = true
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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
          ref={inputRef}
          type="text"
          placeholder="Ville, département..."
          value={searchQuery}
          onChange={handleInputChange}
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
});

LocationSearchFilter.displayName = 'LocationSearchFilter';

export default LocationSearchFilter;
