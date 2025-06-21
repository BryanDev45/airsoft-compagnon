
import { Coordinates } from './types';
import { detectCountryFromStore, getMappedCountryName, getCountryCode } from './countryDetection';
import { areCoordinatesValid } from './coordinatesValidation';

// Function to normalize address components for better geocoding
const normalizeForGeocoding = (text: string): string => {
  return text
    .trim()
    .replace(/,\s*$/, '') // Remove trailing commas
    .replace(/\s+/g, ' '); // Normalize whitespace
};

// Enhanced French character normalization for geocoding
const normalizeFrenchCharacters = (text: string): string => {
  return text
    .replace(/à/g, 'a').replace(/À/g, 'A')
    .replace(/â/g, 'a').replace(/Â/g, 'A')
    .replace(/ä/g, 'a').replace(/Ä/g, 'A')
    .replace(/é/g, 'e').replace(/É/g, 'E')
    .replace(/è/g, 'e').replace(/È/g, 'E')
    .replace(/ê/g, 'e').replace(/Ê/g, 'E')
    .replace(/ë/g, 'e').replace(/Ë/g, 'E')
    .replace(/î/g, 'i').replace(/Î/g, 'I')
    .replace(/ï/g, 'i').replace(/Ï/g, 'I')
    .replace(/ô/g, 'o').replace(/Ô/g, 'O')
    .replace(/ö/g, 'o').replace(/Ö/g, 'O')
    .replace(/ù/g, 'u').replace(/Ù/g, 'U')
    .replace(/û/g, 'u').replace(/Û/g, 'U')
    .replace(/ü/g, 'u').replace(/Ü/g, 'U')
    .replace(/ÿ/g, 'y').replace(/Ÿ/g, 'Y')
    .replace(/ç/g, 'c').replace(/Ç/g, 'C')
    .replace(/ñ/g, 'n').replace(/Ñ/g, 'N');
};

// Enhanced Polish character normalization for geocoding
const normalizePolishCharacters = (text: string): string => {
  return text
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'L')
    .replace(/ą/g, 'a')
    .replace(/Ą/g, 'A')
    .replace(/ć/g, 'c')
    .replace(/Ć/g, 'C')
    .replace(/ę/g, 'e')
    .replace(/Ę/g, 'E')
    .replace(/ń/g, 'n')
    .replace(/Ń/g, 'N')
    .replace(/ó/g, 'o')
    .replace(/Ó/g, 'O')
    .replace(/ś/g, 's')
    .replace(/Ś/g, 'S')
    .replace(/ź/g, 'z')
    .replace(/Ź/g, 'Z')
    .replace(/ż/g, 'z')
    .replace(/Ż/g, 'Z');
};

// Hardcoded coordinates for known stores that have geocoding issues
const KNOWN_STORE_COORDINATES: { [key: string]: Coordinates } = {
  'taiwangun': {
    latitude: 50.0647,  // Kraków coordinates
    longitude: 19.9450
  },
  'airsoft entrepot': {
    latitude: 48.187758,
    longitude: -1.628809
  }
};

// Function to get hardcoded coordinates for known problematic stores
const getKnownStoreCoordinates = (storeName: string): Coordinates | null => {
  const normalizedName = storeName.toLowerCase().trim();
  console.log(`🔍 Checking known coordinates for store: "${normalizedName}"`);
  
  for (const [knownStore, coords] of Object.entries(KNOWN_STORE_COORDINATES)) {
    if (normalizedName.includes(knownStore)) {
      console.log(`✓ Found hardcoded coordinates for ${storeName}:`, coords);
      return coords;
    }
  }
  
  return null;
};

// Enhanced function to geocode an address using OpenStreetMap Nominatim API with improved international support
export const geocodeAddress = async (
  address: string, 
  zipCode: string, 
  city: string, 
  country: string = 'France',
  storeData?: any
): Promise<Coordinates | null> => {
  try {
    const isTaiwangun = storeData?.name?.toLowerCase().includes('taiwangun');
    const isGameLocation = storeData?.type === 'game_location';
    
    // First, check if we have hardcoded coordinates for this store
    if (storeData?.name && !isGameLocation) {
      const knownCoords = getKnownStoreCoordinates(storeData.name);
      if (knownCoords) {
        console.log(`🔍 Using hardcoded coordinates for ${storeData.name}:`, knownCoords);
        return knownCoords;
      }
    }
    
    // Detect actual country if not provided or if it's generic
    let detectedCountry = country;
    if (storeData && !isGameLocation && (country.toLowerCase() === 'france' || !country)) {
      detectedCountry = detectCountryFromStore(storeData);
    }

    // Clean and prepare address components
    const cleanAddress = normalizeForGeocoding(address);
    const cleanCity = normalizeForGeocoding(city);
    const cleanZipCode = normalizeForGeocoding(zipCode);
    
    const mappedCountry = getMappedCountryName(detectedCountry);
    const countryCode = getCountryCode(mappedCountry);
    
    if (isTaiwangun || isGameLocation) {
      console.log(`🔍 ${isGameLocation ? 'GAME LOCATION' : 'TAIWANGUN'} GEOCODING - Starting geocoding process:`, {
        originalAddress: address,
        originalCity: city,
        originalZip: zipCode,
        cleanAddress,
        cleanCity,
        cleanZipCode,
        detectedCountry,
        mappedCountry,
        countryCode
      });
    }

    console.log(`Geocoding address: "${cleanAddress}", City: "${cleanCity}", ZIP: "${cleanZipCode}", Country: "${mappedCountry}", Code: "${countryCode}"`);

    // Create normalized versions for international addresses
    const normalizedAddress = mappedCountry.toLowerCase() === 'poland' 
      ? normalizePolishCharacters(cleanAddress) 
      : normalizeFrenchCharacters(cleanAddress);
    const normalizedCity = mappedCountry.toLowerCase() === 'poland' 
      ? normalizePolishCharacters(cleanCity) 
      : normalizeFrenchCharacters(cleanCity);

    // Enhanced search strategies with priority for French game locations
    const searchQueries = [];

    if (isGameLocation && mappedCountry.toLowerCase() === 'france') {
      // Priority queries for French game locations
      console.log(`Using French game location-specific geocoding for: "${cleanAddress}, ${cleanCity}"`);
      
      searchQueries.push(
        // Most specific with French postal format
        `${cleanAddress}, ${cleanZipCode} ${cleanCity}, France`,
        `${normalizedAddress}, ${cleanZipCode} ${normalizedCity}, France`,
        
        // Address with city variations
        `${cleanAddress}, ${cleanCity}, ${cleanZipCode}, France`,
        `${normalizedAddress}, ${normalizedCity}, ${cleanZipCode}, France`,
        
        // City and postal code focus for better precision
        `${cleanZipCode} ${cleanCity}, France`,
        `${cleanZipCode} ${normalizedCity}, France`,
        
        // Just address and city
        `${cleanAddress}, ${cleanCity}, France`,
        `${normalizedAddress}, ${normalizedCity}, France`,
        
        // City-first approach for French addresses
        `${cleanCity}, ${cleanAddress}, France`,
        `${normalizedCity}, ${normalizedAddress}, France`,
        
        // City only as fallback
        `${cleanCity}, France`,
        `${normalizedCity}, France`
      );
    } else if (mappedCountry.toLowerCase() === 'poland') {
      // Enhanced search strategies specifically for Polish addresses
      console.log(`Using Polish-specific geocoding for: "${cleanAddress}, ${cleanCity}"`);
      
      // Special handling for Taiwangun - very specific queries first
      if (isTaiwangun) {
        searchQueries.push(
          // Most specific Taiwangun queries with various address formats
          'Półłanki 18, 30-740 Kraków, Poland',
          'Pollanki 18, 30-740 Krakow, Poland',
          'Półłanki 18, Kraków, Poland',
          'Pollanki 18, Krakow, Poland',
          'Pollanki 18, Cracow, Poland',
          'ul. Półłanki 18, Kraków, Poland',
          'ul. Pollanki 18, Krakow, Poland',
          // Krakow variations
          '30-740 Kraków, Poland',
          '30-740 Krakow, Poland',
          '30-740 Cracow, Poland',
          'Kraków, Poland',
          'Krakow, Poland',
          'Cracow, Poland',
          // Broader searches
          'Taiwangun Kraków',
          'Taiwangun Krakow',
          'Taiwangun Cracow',
          'Taiwangun Poland',
          // District-specific searches
          'Półłanki, Kraków',
          'Pollanki, Krakow',
          // Postal code only
          '30-740, Poland'
        );
      }
      
      // Standard Polish geocoding queries
      searchQueries.push(
        // Most specific with Polish postal codes first
        `${cleanAddress}, ${cleanZipCode} ${cleanCity}, Poland`,
        `${normalizedAddress}, ${cleanZipCode} ${normalizedCity}, Poland`,
        
        // Try with Kraków variations specifically
        ...(cleanCity.toLowerCase().includes('krakow') || normalizedCity.toLowerCase().includes('krakow') 
          ? [
              `${cleanAddress}, Kraków, Poland`,
              `${normalizedAddress}, Krakow, Poland`,
              `${cleanAddress}, 30-740 Kraków, Poland`,
              `${normalizedAddress}, 30-740 Krakow, Poland`,
              `${cleanAddress}, Cracow, Poland`,
              `${normalizedAddress}, Cracow, Poland`
            ] : []),
        
        // City with postal code variations
        `${cleanZipCode} ${cleanCity}, Poland`,
        `${cleanZipCode} ${normalizedCity}, Poland`,
        
        // Just address and city
        `${cleanAddress}, ${cleanCity}, Poland`,
        `${normalizedAddress}, ${normalizedCity}, Poland`,
        
        // City only as last resort
        `${cleanCity}, Poland`,
        `${normalizedCity}, Poland`,
        
        // Special case for specific known cities
        ...(cleanCity.toLowerCase().includes('krakow') ? ['Kraków, Poland', 'Krakow, Poland', 'Cracow, Poland'] : [])
      );
    } else {
      // Standard search queries for other countries
      searchQueries.push(
        // Most specific first with all components
        `${cleanAddress}, ${cleanZipCode} ${cleanCity}, ${mappedCountry}`,
        `${normalizedAddress}, ${cleanZipCode} ${normalizedCity}, ${mappedCountry}`,
        // Without zip code for international addresses
        `${cleanAddress}, ${cleanCity}, ${mappedCountry}`,
        `${normalizedAddress}, ${normalizedCity}, ${mappedCountry}`,
        // Just city and country as fallback
        `${cleanCity}, ${mappedCountry}`,
        `${normalizedCity}, ${mappedCountry}`,
        // Store name + city + country for better recognition
        ...(storeData?.name && !isGameLocation ? [`${storeData.name}, ${cleanCity}, ${mappedCountry}`] : []),
        // City with zip code
        ...(cleanZipCode ? [`${cleanZipCode} ${cleanCity}, ${mappedCountry}`] : []),
        // Just zip code and country for very specific locations
        ...(cleanZipCode ? [`${cleanZipCode}, ${mappedCountry}`] : [])
      );
    }

    if (isTaiwangun || isGameLocation) {
      console.log(`🔍 ${isGameLocation ? 'GAME LOCATION' : 'TAIWANGUN'} GEOCODING - Search queries (${searchQueries.length} total):`, searchQueries);
    }

    for (let i = 0; i < searchQueries.length; i++) {
      const query = searchQueries[i];
      console.log(`Geocoding attempt ${i + 1}/${searchQueries.length} with query: "${query}"`);
      
      if (isTaiwangun || isGameLocation) {
        console.log(`🔍 ${isGameLocation ? 'GAME LOCATION' : 'TAIWANGUN'} GEOCODING - Attempt ${i + 1}: "${query}"`);
      }
      
      // Enhanced URL with better parameters for international support
      const geocodingUrl = new URL('https://nominatim.openstreetmap.org/search');
      geocodingUrl.searchParams.set('format', 'json');
      geocodingUrl.searchParams.set('q', query);
      geocodingUrl.searchParams.set('limit', '10');
      geocodingUrl.searchParams.set('addressdetails', '1');
      geocodingUrl.searchParams.set('extratags', '1');
      geocodingUrl.searchParams.set('namedetails', '1');
      geocodingUrl.searchParams.set('accept-language', 'fr,en,pl,local');
      
      // Add country code filter if available for more precise results
      if (countryCode) {
        geocodingUrl.searchParams.set('countrycodes', countryCode);
      }
      
      try {
        const response = await fetch(geocodingUrl.toString(), {
          headers: {
            'User-Agent': 'AirsoftCommunityApp/1.0'
          }
        });
        
        if (!response.ok) {
          console.warn(`Geocoding API error for query "${query}": ${response.status}`);
          if (isTaiwangun || isGameLocation) {
            console.log(`🔍 ${isGameLocation ? 'GAME LOCATION' : 'TAIWANGUN'} GEOCODING - API error: ${response.status}`);
          }
          continue;
        }
        
        const data = await response.json();
        
        if (isTaiwangun || isGameLocation) {
          console.log(`🔍 ${isGameLocation ? 'GAME LOCATION' : 'TAIWANGUN'} GEOCODING - Raw API response for "${query}":`, {
            query,
            resultsCount: data?.length || 0,
            url: geocodingUrl.toString(),
            response: data
          });
        }
        
        if (data && data.length > 0) {
          console.log(`Geocoding API returned ${data.length} results for query: "${query}"`);
          
          if (isTaiwangun || isGameLocation) {
            console.log(`🔍 ${isGameLocation ? 'GAME LOCATION' : 'TAIWANGUN'} GEOCODING - Results for "${query}":`, data.map(r => ({
              display_name: r.display_name,
              lat: r.lat,
              lon: r.lon,
              country: r.address?.country,
              city: r.address?.city || r.address?.town || r.address?.village,
              importance: r.importance,
              place_rank: r.place_rank,
              osm_type: r.osm_type
            })));
          }
          
          // Enhanced result evaluation with better scoring for international addresses
          for (const result of data) {
            const { lat, lon, address: resultAddress, importance = 0 } = result;
            const coordinates: Coordinates = {
              longitude: parseFloat(lon),
              latitude: parseFloat(lat)
            };
            
            console.log(`Evaluating result: lat=${lat}, lon=${lon}, country="${resultAddress?.country}", city="${resultAddress?.city || resultAddress?.town || resultAddress?.village}"`);
            
            if (isTaiwangun || isGameLocation) {
              console.log(`🔍 ${isGameLocation ? 'GAME LOCATION' : 'TAIWANGUN'} GEOCODING - Evaluating result:`, {
                coordinates: { lat, lon },
                country: resultAddress?.country,
                city: resultAddress?.city || resultAddress?.town || resultAddress?.village,
                display_name: result.display_name,
                importance,
                place_rank: result.place_rank,
                validation: {
                  isValid: areCoordinatesValid(coordinates.latitude, coordinates.longitude),
                  latValid: !isNaN(coordinates.latitude) && coordinates.latitude !== 0,
                  lonValid: !isNaN(coordinates.longitude) && coordinates.longitude !== 0
                }
              });
            }
            
            // Validate that the result is reasonable
            if (areCoordinatesValid(coordinates.latitude, coordinates.longitude)) {
              const resultCountry = (resultAddress?.country || '').toLowerCase();
              const expectedCountry = mappedCountry.toLowerCase();
              
              // Enhanced country validation
              const isCountryMatch = 
                resultCountry.includes(expectedCountry) || 
                expectedCountry.includes(resultCountry) ||
                (expectedCountry === 'poland' && (resultCountry.includes('polska') || resultCountry.includes('poland'))) ||
                (expectedCountry === 'france' && (resultCountry.includes('france') || resultCountry.includes('république française'))) ||
                !countryCode || // If no country code, be more lenient
                i >= searchQueries.length - 3; // For last resort queries, be more lenient
              
              // Enhanced city validation with international variations
              const resultCity = (
                resultAddress?.city || 
                resultAddress?.town || 
                resultAddress?.village || 
                resultAddress?.municipality || 
                ''
              ).toLowerCase();
              
              const isCityMatch = 
                resultCity.includes(cleanCity.toLowerCase()) || 
                cleanCity.toLowerCase().includes(resultCity) ||
                resultCity.includes(normalizedCity.toLowerCase()) ||
                normalizedCity.toLowerCase().includes(resultCity) ||
                // Special case for Kraków/Krakow
                (cleanCity.toLowerCase().includes('krakow') && resultCity.includes('krak')) ||
                // French city variations
                (mappedCountry.toLowerCase() === 'france' && resultCity.length > 3 && cleanCity.toLowerCase().includes(resultCity)) ||
                i >= searchQueries.length - 2; // Be more lenient for fallback queries
              
              // Enhanced scoring system with country/location specific bonuses
              let score = importance;
              if (isCountryMatch) score += 0.4;
              if (isCityMatch) score += 0.4;
              if (resultAddress?.postcode === cleanZipCode) score += 0.3;
              if (i < 2) score += 0.2; // Bonus for most specific queries
              if (isGameLocation && mappedCountry.toLowerCase() === 'france') score += 0.1; // Bonus for French game locations
              
              console.log(`Geocoding result: Query="${query}", Score=${score.toFixed(2)}, Country="${resultAddress?.country}", City="${resultCity}", Coords=(${coordinates.latitude}, ${coordinates.longitude})`);
              
              if (isTaiwangun || isGameLocation) {
                console.log(`🔍 ${isGameLocation ? 'GAME LOCATION' : 'TAIWANGUN'} GEOCODING - Score analysis:`, {
                  query,
                  score: score.toFixed(2),
                  isCountryMatch,
                  isCityMatch,
                  coordinates,
                  resultCountry,
                  expectedCountry,
                  resultCity,
                  cleanCity: cleanCity.toLowerCase(),
                  willAccept: (isCountryMatch && isCityMatch) || score > 0.4 || i >= 3
                });
              }
              
              // More lenient acceptance criteria for French game locations
              const minScore = isGameLocation && mappedCountry.toLowerCase() === 'france' 
                ? 0.3 
                : mappedCountry.toLowerCase() === 'poland' && i < 3 
                ? 0.5 
                : 0.4;
              
              // Accept result if it meets minimum criteria
              if ((isCountryMatch && isCityMatch) || score > minScore || i >= 3) {
                console.log(`✓ Geocoding successful with query: "${query}"`);
                
                if (isTaiwangun || isGameLocation) {
                  console.log(`🔍 ${isGameLocation ? 'GAME LOCATION' : 'TAIWANGUN'} GEOCODING - ✓ SUCCESS! Final coordinates:`, {
                    query,
                    coordinates,
                    score: score.toFixed(2),
                    resultCountry,
                    resultCity,
                    display_name: result.display_name
                  });
                }
                
                return coordinates;
              } else {
                if (isTaiwangun || isGameLocation) {
                  console.log(`🔍 ${isGameLocation ? 'GAME LOCATION' : 'TAIWANGUN'} GEOCODING - Result rejected, score too low or criteria not met`);
                }
              }
            } else {
              if (isTaiwangun || isGameLocation) {
                console.log(`🔍 ${isGameLocation ? 'GAME LOCATION' : 'TAIWANGUN'} GEOCODING - Invalid coordinates:`, coordinates);
              }
            }
          }
        } else {
          console.log(`No results returned for query: "${query}"`);
          if (isTaiwangun || isGameLocation) {
            console.log(`🔍 ${isGameLocation ? 'GAME LOCATION' : 'TAIWANGUN'} GEOCODING - No results for: "${query}"`);
          }
        }
      } catch (fetchError) {
        console.warn(`Network error for geocoding query "${query}":`, fetchError);
        if (isTaiwangun || isGameLocation) {
          console.log(`🔍 ${isGameLocation ? 'GAME LOCATION' : 'TAIWANGUN'} GEOCODING - Network error:`, fetchError);
        }
      }
      
      // Add delay between requests to respect rate limits
      if (i < searchQueries.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Reasonable delay for better performance
      }
    }
    
    console.log(`❌ No valid geocoding results found for: Address="${cleanAddress}", City="${cleanCity}", ZIP="${cleanZipCode}", Country="${mappedCountry}"`);
    
    if (isTaiwangun) {
      console.log(`🔍 TAIWANGUN GEOCODING - ❌ FAILED - No valid results found after all attempts. Will fall back to hardcoded coordinates.`);
      // Return hardcoded Krakow coordinates as final fallback for Taiwangun
      const fallbackCoords = { latitude: 50.0647, longitude: 19.9450 };
      console.log(`🔍 TAIWANGUN GEOCODING - Using fallback Krakow coordinates:`, fallbackCoords);
      return fallbackCoords;
    }
    
    if (isGameLocation) {
      console.log(`🔍 GAME LOCATION GEOCODING - ❌ FAILED - No valid results found. This may affect map accuracy.`);
    }
    
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    
    if (storeData?.name?.toLowerCase().includes('taiwangun')) {
      console.log(`🔍 TAIWANGUN GEOCODING - ❌ ERROR:`, error);
      // Return hardcoded Krakow coordinates as final fallback for Taiwangun
      const fallbackCoords = { latitude: 50.0647, longitude: 19.9450 };
      console.log(`🔍 TAIWANGUN GEOCODING - Using fallback Krakow coordinates after error:`, fallbackCoords);
      return fallbackCoords;
    }
    
    if (storeData?.type === 'game_location') {
      console.log(`🔍 GAME LOCATION GEOCODING - ❌ ERROR:`, error);
    }
    
    return null;
  }
};
