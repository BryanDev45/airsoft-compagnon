
import { useState } from 'react';

export interface EventFilterState {
  selectedType: string;
  selectedDepartment: string;
  selectedDate: Date | undefined;
}

export function useEventFilters() {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  return {
    selectedType,
    setSelectedType,
    selectedDepartment,
    setSelectedDepartment,
    selectedDate,
    setSelectedDate
  };
}
