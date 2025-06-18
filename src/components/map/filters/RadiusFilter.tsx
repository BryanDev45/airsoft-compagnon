
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface RadiusFilterProps {
  searchRadius: number[];
  setSearchRadius: (radius: number[]) => void;
  showLabel?: boolean;
}

const RadiusFilter: React.FC<RadiusFilterProps> = ({
  searchRadius,
  setSearchRadius,
  showLabel = true
}) => {
  return (
    <div>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Rayon de recherche: {searchRadius[0]} km
        </label>
      )}
      {!showLabel && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Rayon: {searchRadius[0]} km
        </label>
      )}
      <Slider
        value={searchRadius}
        onValueChange={setSearchRadius}
        max={200}
        min={5}
        step={5}
        className="w-full"
      />
    </div>
  );
};

export default RadiusFilter;
