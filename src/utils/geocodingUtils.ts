
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
  
  // Check if coordinates are in a reasonable global range
  const isInGlobalRange = lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  
  return !isCloseToZero && isInGlobalRange;
};

// Function to geocode an address using OpenStreetMap Nominatim API with improved international support
export const geocodeAddress = async (
  address: string, 
  zipCode: string, 
  city: string, 
  country: string = 'France'
): Promise<Coordinates | null> => {
  try {
    // Try multiple search strategies for better international coverage
    const searchQueries = [
      // Most specific first
      `${address}, ${zipCode} ${city}, ${country}`,
      // Without zip code for international addresses where zip might not work well
      `${address}, ${city}, ${country}`,
      // Just city and country as fallback
      `${city}, ${country}`,
      // City only as last resort
      city
    ];

    for (const query of searchQueries) {
      console.log('Geocoding attempt with query:', query);
      
      const geocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=3&addressdetails=1`;
      
      const response = await fetch(geocodingUrl, {
        headers: {
          'User-Agent': 'AirsoftCommunityApp/1.0'
        }
      });
      
      if (!response.ok) {
        console.warn(`Geocoding API error for query "${query}": ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Find the best match based on address components
        for (const result of data) {
          const { lat, lon, address: resultAddress } = result;
          const coordinates: Coordinates = {
            longitude: parseFloat(lon),
            latitude: parseFloat(lat)
          };
          
          // Validate that the result is reasonable
          if (areCoordinatesValid(coordinates.latitude, coordinates.longitude)) {
            console.log('Geocoding successful with query:', query, 'Result:', coordinates, 'Address:', resultAddress);
            return coordinates;
          }
        }
      }
    }
    
    console.log('No valid geocoding results found for:', { address, zipCode, city, country });
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

// Default coordinates for different regions
export const getDefaultCoordinatesByCountry = (country: string): Coordinates => {
  const defaults: Record<string, Coordinates> = {
    'France': { longitude: 2.3522, latitude: 48.8566 }, // Paris
    'france': { longitude: 2.3522, latitude: 48.8566 },
    'Belgium': { longitude: 4.3517, latitude: 50.8476 }, // Brussels
    'belgique': { longitude: 4.3517, latitude: 50.8476 },
    'Switzerland': { longitude: 7.4474, latitude: 46.9480 }, // Bern
    'suisse': { longitude: 7.4474, latitude: 46.9480 },
    'Luxembourg': { longitude: 6.1296, latitude: 49.8153 }, // Luxembourg City
    'luxembourg': { longitude: 6.1296, latitude: 49.8153 },
    'Poland': { longitude: 21.0122, latitude: 52.2297 }, // Warsaw
    'pologne': { longitude: 21.0122, latitude: 52.2297 },
    'Germany': { longitude: 13.4050, latitude: 52.5200 }, // Berlin
    'allemagne': { longitude: 13.4050, latitude: 52.5200 },
    'Spain': { longitude: -3.7038, latitude: 40.4168 }, // Madrid
    'espagne': { longitude: -3.7038, latitude: 40.4168 },
    'Italy': { longitude: 12.4964, latitude: 41.9028 }, // Rome
    'italie': { longitude: 12.4964, latitude: 41.9028 }
  };

  return defaults[country] || defaults['France']; // Default to France if country not found
};

// Function to get valid coordinates for a location, with fallback to geocoding
export const getValidCoordinates = async (
  storedLat: number | null,
  storedLng: number | null,
  address: string,
  zipCode: string,
  city: string,
  country: string = 'France'
): Promise<Coordinates> => {
  // First, try to use stored coordinates if they are valid
  if (areCoordinatesValid(storedLat, storedLng)) {
    return {
      longitude: storedLng!,
      latitude: storedLat!
    };
  }
  
  // If stored coordinates are invalid, try geocoding
  const geocodedCoords = await geocodeAddress(address, zipCode, city, country);
  if (geocodedCoords && areCoordinatesValid(geocodedCoords.latitude, geocodedCoords.longitude)) {
    return geocodedCoords;
  }
  
  // Fallback to country-specific default coordinates
  const defaultCoords = getDefaultCoordinatesByCountry(country);
  console.log('Using default coordinates for country:', country, 'Coords:', defaultCoords, 'Location:', { address, zipCode, city });
  return defaultCoords;
};
