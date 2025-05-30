
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

// Function to detect country from address or store info
const detectCountryFromStore = (store: any): string => {
  // Check if store has country field
  if (store.country) {
    return store.country.toLowerCase();
  }
  
  // Try to detect from address patterns
  const fullAddress = `${store.address} ${store.city}`.toLowerCase();
  
  // Country detection patterns
  if (fullAddress.includes('taiwan') || store.name?.toLowerCase().includes('taiwan')) {
    return 'taiwan';
  }
  if (fullAddress.includes('poland') || fullAddress.includes('polska') || store.name?.toLowerCase().includes('poland')) {
    return 'poland';
  }
  if (fullAddress.includes('germany') || fullAddress.includes('deutschland') || store.name?.toLowerCase().includes('german')) {
    return 'germany';
  }
  if (fullAddress.includes('belgium') || fullAddress.includes('belgique') || fullAddress.includes('belgië')) {
    return 'belgium';
  }
  if (fullAddress.includes('switzerland') || fullAddress.includes('suisse') || fullAddress.includes('schweiz')) {
    return 'switzerland';
  }
  if (fullAddress.includes('spain') || fullAddress.includes('españa') || fullAddress.includes('espagne')) {
    return 'spain';
  }
  if (fullAddress.includes('italy') || fullAddress.includes('italia') || fullAddress.includes('italie')) {
    return 'italy';
  }
  
  // Default to France if no specific country detected
  return 'france';
};

// Function to geocode an address using OpenStreetMap Nominatim API with improved international support
export const geocodeAddress = async (
  address: string, 
  zipCode: string, 
  city: string, 
  country: string = 'France',
  storeData?: any
): Promise<Coordinates | null> => {
  try {
    // Detect actual country if not provided or if it's generic
    let detectedCountry = country;
    if (storeData && (country.toLowerCase() === 'france' || !country)) {
      detectedCountry = detectCountryFromStore(storeData);
    }

    // Clean and prepare address components
    const cleanAddress = address.replace(/,\s*$/, '').trim();
    const cleanCity = city.replace(/,\s*$/, '').trim();
    
    // Country name mapping for better geocoding
    const countryMapping: { [key: string]: string } = {
      'taiwan': 'Taiwan',
      'poland': 'Poland',
      'polska': 'Poland',
      'germany': 'Germany',
      'deutschland': 'Germany',
      'belgium': 'Belgium',
      'belgique': 'Belgium',
      'belgië': 'Belgium',
      'switzerland': 'Switzerland',
      'suisse': 'Switzerland',
      'schweiz': 'Switzerland',
      'spain': 'Spain',
      'españa': 'Spain',
      'espagne': 'Spain',
      'italy': 'Italy',
      'italia': 'Italy',
      'italie': 'Italy',
      'france': 'France'
    };

    const mappedCountry = countryMapping[detectedCountry.toLowerCase()] || detectedCountry;

    // Try multiple search strategies for better international coverage
    const searchQueries = [
      // Most specific first with cleaned data
      `${cleanAddress}, ${zipCode} ${cleanCity}, ${mappedCountry}`,
      // Without zip code for international addresses
      `${cleanAddress}, ${cleanCity}, ${mappedCountry}`,
      // Just city and country as fallback
      `${cleanCity}, ${mappedCountry}`,
      // City only as last resort
      cleanCity
    ];

    for (const query of searchQueries) {
      console.log('Geocoding attempt with query:', query, 'for store:', storeData?.name);
      
      const geocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=${getCountryCode(mappedCountry)}`;
      
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
        // Find the best match based on address components and country
        for (const result of data) {
          const { lat, lon, address: resultAddress } = result;
          const coordinates: Coordinates = {
            longitude: parseFloat(lon),
            latitude: parseFloat(lat)
          };
          
          // Validate that the result is reasonable and in the right country
          if (areCoordinatesValid(coordinates.latitude, coordinates.longitude)) {
            // Additional validation: check if result is in expected country
            const resultCountry = resultAddress?.country?.toLowerCase() || '';
            const expectedCountry = mappedCountry.toLowerCase();
            
            if (resultCountry.includes(expectedCountry) || expectedCountry.includes(resultCountry) || query === cleanCity) {
              console.log('Geocoding successful with query:', query, 'Result:', coordinates, 'Country:', resultAddress?.country);
              return coordinates;
            }
          }
        }
      }
    }
    
    console.log('No valid geocoding results found for:', { address, zipCode, city, country: mappedCountry, detectedCountry });
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

// Helper function to get country codes for Nominatim API
const getCountryCode = (country: string): string => {
  const countryCodes: { [key: string]: string } = {
    'France': 'fr',
    'Belgium': 'be',
    'Switzerland': 'ch',
    'Germany': 'de',
    'Spain': 'es',
    'Italy': 'it',
    'Poland': 'pl',
    'Taiwan': 'tw'
  };
  
  return countryCodes[country] || '';
};

// Default coordinates for different regions
export const getDefaultCoordinatesByCountry = (country: string): Coordinates => {
  const defaults: Record<string, Coordinates> = {
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

  return defaults[country] || defaults['France']; // Default to France if country not found
};

// Function to get valid coordinates for a location, with fallback to geocoding
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
