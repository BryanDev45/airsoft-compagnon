
import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileFiltersToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  filteredCount: number;
}

const MobileFiltersToggle: React.FC<MobileFiltersToggleProps> = ({
  isOpen,
  onToggle,
  filteredCount
}) => {
  return (
    <Button
      onClick={onToggle}
      className="absolute top-4 left-4 z-30 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-lg"
      size="sm"
    >
      {isOpen ? (
        <X className="h-4 w-4 mr-2" />
      ) : (
        <Filter className="h-4 w-4 mr-2" />
      )}
      {isOpen ? 'Fermer' : 'Filtres'}
      {!isOpen && filteredCount > 0 && (
        <span className="ml-1 text-xs bg-airsoft-red text-white rounded-full px-1.5 py-0.5">
          {filteredCount}
        </span>
      )}
    </Button>
  );
};

export default MobileFiltersToggle;
