
// Types and interfaces for geocoding functionality

export interface Coordinates {
  longitude: number;
  latitude: number;
}

export interface CountryCoordinates {
  [key: string]: Coordinates;
}

export interface CountryPattern {
  keywords: string[];
  country: string;
}

export interface CountryCodeMapping {
  [key: string]: string;
}
