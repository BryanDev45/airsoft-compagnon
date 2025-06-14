
import { Coordinates, CountryCoordinates } from './types';

// Function to check if coordinates are valid (not null, not 0,0 or close to it)
export const areCoordinatesValid = (lat: number | null, lng: number | null): boolean => {
  if (!lat || !lng || isNaN(lat) || isNaN(lng)) return false;
  
  // Check if coordinates are close to 0,0 (null island)
  const isCloseToZero = Math.abs(lat) < 0.1 && Math.abs(lng) < 0.1;
  
  // Check if coordinates are in a reasonable global range
  const isInGlobalRange = lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  
  return !isCloseToZero && isInGlobalRange;
};

// Enhanced default coordinates for different regions
const DEFAULT_COORDINATES: CountryCoordinates = {
  'France': { longitude: 2.3522, latitude: 48.8566 }, // Paris
  'france': { longitude: 2.3522, latitude: 48.8566 },
  'Belgium': { longitude: 4.3517, latitude: 50.8476 }, // Brussels
  'belgique': { longitude: 4.3517, latitude: 50.8476 },
  'belgium': { longitude: 4.3517, latitude: 50.8476 },
  'Switzerland': { longitude: 7.4474, latitude: 46.9480 }, // Bern
  'suisse': { longitude: 7.4474, latitude: 46.9480 },
  'switzerland': { longitude: 7.4474, latitude: 46.9480 },
  'Luxembourg': { longitude: 6.1296, latitude: 49.8153 }, // Luxembourg City
  'luxembourg': { longitude: 6.1296, latitude: 49.8153 },
  'Poland': { longitude: 21.0122, latitude: 52.2297 }, // Warsaw
  'pologne': { longitude: 21.0122, latitude: 52.2297 },
  'poland': { longitude: 21.0122, latitude: 52.2297 },
  'Germany': { longitude: 13.4050, latitude: 52.5200 }, // Berlin
  'allemagne': { longitude: 13.4050, latitude: 52.5200 },
  'germany': { longitude: 13.4050, latitude: 52.5200 },
  'Spain': { longitude: -3.7038, latitude: 40.4168 }, // Madrid
  'espagne': { longitude: -3.7038, latitude: 40.4168 },
  'spain': { longitude: -3.7038, latitude: 40.4168 },
  'Italy': { longitude: 12.4964, latitude: 41.9028 }, // Rome
  'italie': { longitude: 12.4964, latitude: 41.9028 },
  'italy': { longitude: 12.4964, latitude: 41.9028 },
  'Taiwan': { longitude: 121.5654, latitude: 25.0330 }, // Taipei
  'taiwan': { longitude: 121.5654, latitude: 25.0330 }
};

export const getDefaultCoordinatesByCountry = (country: string): Coordinates => {
  return DEFAULT_COORDINATES[country] || DEFAULT_COORDINATES['France']; // Default to France if country not found
};
