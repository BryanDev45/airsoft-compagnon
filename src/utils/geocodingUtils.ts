
// Main geocoding utilities file - refactored into smaller modules
import { Coordinates } from './geocoding/types';
import { geocodeAddress } from './geocoding/geocodingService';
import { areCoordinatesValid, getDefaultCoordinatesByCountry } from './geocoding/coordinatesValidation';
import { detectCountryFromStore } from './geocoding/countryDetection';

// Re-export types and functions for backward compatibility
export type { Coordinates };
export { areCoordinatesValid, getDefaultCoordinatesByCountry };

// Enhanced function to get valid coordinates for a location, with fallback to geocoding
export const getValidCoordinates = async (
  storedLat: number | null,
  storedLng: number | null,
  address: string,
  zipCode: string,
  city: string,
  country: string = 'France',
  storeData?: any
): Promise<Coordinates> => {
  // First, try to use stored coordinates if they are valid
  if (areCoordinatesValid(storedLat, storedLng)) {
    return {
      longitude: storedLng!,
      latitude: storedLat!
    };
  }
  
  // If stored coordinates are invalid, try geocoding with store data for better country detection
  const geocodedCoords = await geocodeAddress(address, zipCode, city, country, storeData);
  if (geocodedCoords && areCoordinatesValid(geocodedCoords.latitude, geocodedCoords.longitude)) {
    return geocodedCoords;
  }
  
  // Fallback to country-specific default coordinates based on detected country
  const detectedCountry = storeData ? detectCountryFromStore(storeData) : country;
  const defaultCoords = getDefaultCoordinatesByCountry(detectedCountry);
  console.log('Using default coordinates for country:', detectedCountry, 'Coords:', defaultCoords, 'Location:', { address, zipCode, city });
  return defaultCoords;
};
