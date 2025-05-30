
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EventTypeFilterProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
}

const EventTypeFilter: React.FC<EventTypeFilterProps> = ({
  selectedType,
  setSelectedType
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Type
      </label>
      <Select value={selectedType} onValueChange={setSelectedType}>
        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
          <SelectValue placeholder="Tous les types" />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 border-gray-600">
          <SelectItem value="all">Tous les types</SelectItem>
          <SelectItem value="dominicale">Parties dominicales</SelectItem>
          <SelectItem value="operation">Opérations</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default EventTypeFilter;
