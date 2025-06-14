
export interface City {
  name: string;
  country: string;
  fullName: string;
}

export interface CityComboboxProps {
  defaultValue?: string;
  onSelect: (value: string) => void;
}
