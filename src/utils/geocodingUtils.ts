
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
  
  // Élargir la plage pour accepter les adresses internationales
  // Plage élargie pour couvrir l'Europe, l'Asie et d'autres régions
  const isInReasonableRange = lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  
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
    // Pour les adresses non françaises, adapter le format
    let fullAddress;
    if (country && country.toLowerCase() !== 'france') {
      // Format international : adresse, ville code_postal, pays
      fullAddress = `${address}, ${city} ${zipCode}, ${country}`;
    } else {
      // Format français traditionnel
      fullAddress = `${address}, ${zipCode} ${city}, ${country}`;
    }
    
    console.log('Geocoding address:', fullAddress);
    
    const geocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1&countrycodes=${getCountryCode(country)}`;
    
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
    
    // Si pas de résultat avec l'adresse complète, essayer juste avec la ville et le pays
    console.log('No results for full address, trying city and country...');
    const cityCountryUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(`${city}, ${country}`)}&limit=1&countrycodes=${getCountryCode(country)}`;
    
    const cityResponse = await fetch(cityCountryUrl, {
      headers: {
        'User-Agent': 'AirsoftCommunityApp/1.0'
      }
    });
    
    if (cityResponse.ok) {
      const cityData = await cityResponse.json();
      if (cityData && cityData.length > 0) {
        const { lat, lon } = cityData[0];
        const coordinates: Coordinates = {
          longitude: parseFloat(lon),
          latitude: parseFloat(lat)
        };
        
        console.log('City geocoding successful:', coordinates);
        return coordinates;
      }
    }
    
    console.log('No geocoding results found for:', fullAddress);
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

// Fonction pour obtenir le code pays ISO pour Nominatim
const getCountryCode = (country: string): string => {
  const countryMap: { [key: string]: string } = {
    'france': 'fr',
    'germany': 'de',
    'deutschland': 'de',
    'spain': 'es',
    'españa': 'es',
    'italy': 'it',
    'italia': 'it',
    'united kingdom': 'gb',
    'uk': 'gb',
    'belgium': 'be',
    'belgique': 'be',
    'nederland': 'nl',
    'netherlands': 'nl',
    'poland': 'pl',
    'polska': 'pl',
    'czech republic': 'cz',
    'taiwan': 'tw',
    'usa': 'us',
    'united states': 'us',
    'canada': 'ca',
    'switzerland': 'ch',
    'suisse': 'ch',
    'austria': 'at',
    'österreich': 'at'
  };
  
  const lowerCountry = country.toLowerCase().trim();
  return countryMap[lowerCountry] || '';
};

// Default coordinates for France (Paris)
export const DEFAULT_FRANCE_COORDINATES: Coordinates = {
  longitude: 2.3522,
  latitude: 48.8566
};

// Coordonnées par défaut selon le pays
export const getDefaultCoordinatesByCountry = (country: string): Coordinates => {
  const defaultCoords: { [key: string]: Coordinates } = {
    'taiwan': { longitude: 121.5654, latitude: 25.0330 }, // Taipei
    'germany': { longitude: 13.4050, latitude: 52.5200 }, // Berlin
    'spain': { longitude: -3.7026, latitude: 40.4165 }, // Madrid
    'italy': { longitude: 12.4964, latitude: 41.9028 }, // Rome
    'uk': { longitude: -0.1276, latitude: 51.5074 }, // Londres
    'belgium': { longitude: 4.3517, latitude: 50.8503 }, // Bruxelles
    'netherlands': { longitude: 4.9041, latitude: 52.3676 }, // Amsterdam
    'poland': { longitude: 21.0122, latitude: 52.2297 }, // Varsovie
    'usa': { longitude: -74.0059, latitude: 40.7128 }, // New York
    'canada': { longitude: -75.6972, latitude: 45.4215 }, // Ottawa
    'switzerland': { longitude: 7.4474, latitude: 46.9481 }, // Berne
    'austria': { longitude: 16.3738, latitude: 48.2082 } // Vienne
  };
  
  const lowerCountry = country.toLowerCase().trim();
  return defaultCoords[lowerCountry] || DEFAULT_FRANCE_COORDINATES;
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
  if (geocodedCoords) {
    return geocodedCoords;
  }
  
  // Fallback to default coordinates based on country
  console.log('Using default coordinates for country:', country);
  return getDefaultCoordinatesByCountry(country);
};
