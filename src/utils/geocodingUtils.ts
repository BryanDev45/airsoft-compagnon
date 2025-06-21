
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
  console.log(`🔍 GET VALID COORDS - Starting for: "${address}, ${zipCode} ${city}", Stored: (${storedLat}, ${storedLng})`);
  
  // First, try to use stored coordinates if they are valid
  if (areCoordinatesValid(storedLat, storedLng)) {
    console.log(`✅ GET VALID COORDS - Using stored coordinates: (${storedLat}, ${storedLng})`);
    return {
      longitude: storedLng!,
      latitude: storedLat!
    };
  }
  
  console.log(`🔍 GET VALID COORDS - Invalid stored coordinates, attempting geocoding...`);
  
  // If stored coordinates are invalid, try geocoding with store data for better country detection
  const geocodedCoords = await geocodeAddress(address, zipCode, city, country, storeData);
  if (geocodedCoords && areCoordinatesValid(geocodedCoords.latitude, geocodedCoords.longitude)) {
    console.log(`✅ GET VALID COORDS - Geocoding successful: (${geocodedCoords.latitude}, ${geocodedCoords.longitude})`);
    return geocodedCoords;
  }
  
  // Fallback to country-specific default coordinates based on detected country
  const detectedCountry = storeData ? detectCountryFromStore(storeData) : country;
  const defaultCoords = getDefaultCoordinatesByCountry(detectedCountry);
  console.log(`⚠️ GET VALID COORDS - Using default coordinates for country: ${detectedCountry}, Coords: (${defaultCoords.latitude}, ${defaultCoords.longitude}), Location: ${address}, ${zipCode} ${city}`);
  return defaultCoords;
};
