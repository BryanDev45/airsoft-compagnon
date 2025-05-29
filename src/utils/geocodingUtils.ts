
// Utility functions for geocoding and coordinate validation

export interface Coordinates {
  longitude: number;
  latitude: number;
}

// Function to check if coordinates are valid (not null, not 0,0 or close to it)
export const areCoordinatesValid = (lat: number | null, lng: number | null): boolean => {
  if (!lat || !lng || isNaN(lat) || isNaN(lng)) return false;
  
  // Check if coordinates are close to 0,0 (null island)
  const isCloseToZero = Math.abs(lat) < 0.1 && Math.abs(lng) < 0.1;
  
  // Check if coordinates are in a reasonable range for France/Europe
  const isInReasonableRange = lat >= 40 && lat <= 55 && lng >= -5 && lng <= 10;
  
  return !isCloseToZero && isInReasonableRange;
};

// Function to geocode an address using OpenStreetMap Nominatim API
export const geocodeAddress = async (
  address: string, 
  zipCode: string, 
  city: string, 
  country: string = 'France'
): Promise<Coordinates | null> => {
  try {
    const fullAddress = `${address}, ${zipCode} ${city}, ${country}`;
    console.log('Geocoding address:', fullAddress);
    
    const geocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`;
    
    const response = await fetch(geocodingUrl, {
      headers: {
        'User-Agent': 'AirsoftCommunityApp/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      const coordinates: Coordinates = {
        longitude: parseFloat(lon),
        latitude: parseFloat(lat)
      };
      
      console.log('Geocoding successful:', coordinates);
      return coordinates;
    }
    
    console.log('No geocoding results found for:', fullAddress);
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

// Default coordinates for France (Paris)
export const DEFAULT_FRANCE_COORDINATES: Coordinates = {
  longitude: 2.3522,
  latitude: 48.8566
};

// Function to get valid coordinates for a location, with fallback to geocoding
export const getValidCoordinates = async (
  storedLat: number | null,
  storedLng: number | null,
  address: string,
  zipCode: string,
  city: string
): Promise<Coordinates> => {
  // First, try to use stored coordinates if they are valid
  if (areCoordinatesValid(storedLat, storedLng)) {
    return {
      longitude: storedLng!,
      latitude: storedLat!
    };
  }
  
  // If stored coordinates are invalid, try geocoding
  const geocodedCoords = await geocodeAddress(address, zipCode, city);
  if (geocodedCoords) {
    return geocodedCoords;
  }
  
  // Fallback to default coordinates
  console.log('Using default coordinates for:', { address, zipCode, city });
  return DEFAULT_FRANCE_COORDINATES;
};
