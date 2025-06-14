
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

// Enhanced function to geocode an address using OpenStreetMap Nominatim API with improved international support
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
    const cleanAddress = normalizeForGeocoding(address);
    const cleanCity = normalizeForGeocoding(city);
    const cleanZipCode = normalizeForGeocoding(zipCode);
    
    const mappedCountry = getMappedCountryName(detectedCountry);
    const countryCode = getCountryCode(mappedCountry);

    const isTaiwangun = storeData?.name?.toLowerCase().includes('taiwangun');
    
    if (isTaiwangun) {
      console.log(`🔍 TAIWANGUN GEOCODING - Starting geocoding process:`, {
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

    // Create normalized versions for Polish addresses
    const normalizedAddress = normalizePolishCharacters(cleanAddress);
    const normalizedCity = normalizePolishCharacters(cleanCity);

    // Enhanced search strategies specifically for Polish addresses
    const searchQueries = [];

    // For Polish addresses, try both original and normalized versions with more specific strategies
    if (mappedCountry.toLowerCase() === 'poland') {
      console.log(`Using Polish-specific geocoding for: "${cleanAddress}, ${cleanCity}"`);
      
      // Special handling for Taiwangun - very specific queries first
      if (isTaiwangun) {
        searchQueries.push(
          // Most specific Taiwangun queries
          'Półłanki 18, 30-740 Kraków, Poland',
          'Pollanki 18, 30-740 Krakow, Poland',
          'Półłanki 18, Kraków, Poland',
          'Pollanki 18, Krakow, Poland',
          // Krakow variations
          '30-740 Kraków, Poland',
          '30-740 Krakow, Poland',
          'Kraków, Poland',
          'Krakow, Poland',
          // Broader searches
          'Taiwangun Kraków',
          'Taiwangun Krakow',
          'Taiwangun Poland'
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
              `${normalizedAddress}, 30-740 Krakow, Poland`
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
        ...(cleanCity.toLowerCase().includes('krakow') ? ['Kraków, Poland', 'Krakow, Poland'] : [])
      );
    } else {
      // Standard search queries for other countries
      searchQueries.push(
        // Most specific first with all components
        `${cleanAddress}, ${cleanZipCode} ${cleanCity}, ${mappedCountry}`,
        // Without zip code for international addresses
        `${cleanAddress}, ${cleanCity}, ${mappedCountry}`,
        // Just city and country as fallback
        `${cleanCity}, ${mappedCountry}`,
        // Store name + city + country for better recognition
        ...(storeData?.name ? [`${storeData.name}, ${cleanCity}, ${mappedCountry}`] : []),
        // City with zip code
        ...(cleanZipCode ? [`${cleanZipCode} ${cleanCity}, ${mappedCountry}`] : []),
        // Just zip code and country for very specific locations
        ...(cleanZipCode ? [`${cleanZipCode}, ${mappedCountry}`] : [])
      );
    }

    if (isTaiwangun) {
      console.log(`🔍 TAIWANGUN GEOCODING - Search queries:`, searchQueries);
    }

    for (let i = 0; i < searchQueries.length; i++) {
      const query = searchQueries[i];
      console.log(`Geocoding attempt ${i + 1}/${searchQueries.length} with query: "${query}"`);
      
      if (isTaiwangun) {
        console.log(`🔍 TAIWANGUN GEOCODING - Attempt ${i + 1}: "${query}"`);
      }
      
      // Enhanced URL with better parameters for international support
      const geocodingUrl = new URL('https://nominatim.openstreetmap.org/search');
      geocodingUrl.searchParams.set('format', 'json');
      geocodingUrl.searchParams.set('q', query);
      geocodingUrl.searchParams.set('limit', '10');
      geocodingUrl.searchParams.set('addressdetails', '1');
      geocodingUrl.searchParams.set('extratags', '1');
      geocodingUrl.searchParams.set('namedetails', '1');
      geocodingUrl.searchParams.set('accept-language', 'en,pl,local');
      
      // Add country code filter if available for more precise results
      if (countryCode && mappedCountry.toLowerCase() === 'poland') {
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
          if (isTaiwangun) {
            console.log(`🔍 TAIWANGUN GEOCODING - API error: ${response.status}`);
          }
          continue;
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          console.log(`Geocoding API returned ${data.length} results for query: "${query}"`);
          
          if (isTaiwangun) {
            console.log(`🔍 TAIWANGUN GEOCODING - Results for "${query}":`, data.map(r => ({
              display_name: r.display_name,
              lat: r.lat,
              lon: r.lon,
              country: r.address?.country,
              city: r.address?.city || r.address?.town || r.address?.village,
              importance: r.importance
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
            
            if (isTaiwangun) {
              console.log(`🔍 TAIWANGUN GEOCODING - Evaluating result:`, {
                coordinates: { lat, lon },
                country: resultAddress?.country,
                city: resultAddress?.city || resultAddress?.town || resultAddress?.village,
                display_name: result.display_name,
                importance
              });
            }
            
            // Validate that the result is reasonable
            if (areCoordinatesValid(coordinates.latitude, coordinates.longitude)) {
              const resultCountry = (resultAddress?.country || '').toLowerCase();
              const expectedCountry = mappedCountry.toLowerCase();
              
              // Enhanced country validation for Poland
              const isCountryMatch = 
                resultCountry.includes(expectedCountry) || 
                expectedCountry.includes(resultCountry) ||
                (expectedCountry === 'poland' && (resultCountry.includes('polska') || resultCountry.includes('poland'))) ||
                !countryCode || // If no country code, be more lenient
                i >= searchQueries.length - 3; // For last resort queries, be more lenient
              
              // Enhanced city validation with Polish variations
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
                i >= searchQueries.length - 2; // Be more lenient for fallback queries
              
              // Enhanced scoring system
              let score = importance;
              if (isCountryMatch) score += 0.3;
              if (isCityMatch) score += 0.3;
              if (resultAddress?.postcode === cleanZipCode) score += 0.2;
              if (i < 2) score += 0.1; // Bonus for most specific queries
              
              console.log(`Geocoding result: Query="${query}", Score=${score.toFixed(2)}, Country="${resultAddress?.country}", City="${resultCity}", Coords=(${coordinates.latitude}, ${coordinates.longitude})`);
              
              if (isTaiwangun) {
                console.log(`🔍 TAIWANGUN GEOCODING - Score analysis:`, {
                  query,
                  score: score.toFixed(2),
                  isCountryMatch,
                  isCityMatch,
                  coordinates,
                  resultCountry,
                  expectedCountry,
                  resultCity,
                  cleanCity: cleanCity.toLowerCase()
                });
              }
              
              // For Polish addresses, be more strict about country matching initially
              const minScore = mappedCountry.toLowerCase() === 'poland' && i < 3 ? 0.5 : 0.3;
              
              // Accept result if it meets minimum criteria
              if ((isCountryMatch && isCityMatch) || score > minScore || i >= 3) {
                console.log(`✓ Geocoding successful with query: "${query}"`);
                
                if (isTaiwangun) {
                  console.log(`🔍 TAIWANGUN GEOCODING - ✓ SUCCESS! Final coordinates:`, {
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
                if (isTaiwangun) {
                  console.log(`🔍 TAIWANGUN GEOCODING - Result rejected, score too low or criteria not met`);
                }
              }
            } else {
              if (isTaiwangun) {
                console.log(`🔍 TAIWANGUN GEOCODING - Invalid coordinates:`, coordinates);
              }
            }
          }
        } else {
          console.log(`No results returned for query: "${query}"`);
          if (isTaiwangun) {
            console.log(`🔍 TAIWANGUN GEOCODING - No results for: "${query}"`);
          }
        }
      } catch (fetchError) {
        console.warn(`Network error for geocoding query "${query}":`, fetchError);
        if (isTaiwangun) {
          console.log(`🔍 TAIWANGUN GEOCODING - Network error:`, fetchError);
        }
      }
      
      // Add delay between requests to respect rate limits
      if (i < searchQueries.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Increased delay
      }
    }
    
    console.log(`❌ No valid geocoding results found for: Address="${cleanAddress}", City="${cleanCity}", ZIP="${cleanZipCode}", Country="${mappedCountry}"`);
    
    if (isTaiwangun) {
      console.log(`🔍 TAIWANGUN GEOCODING - ❌ FAILED - No valid results found after all attempts`);
    }
    
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    
    if (storeData?.name?.toLowerCase().includes('taiwangun')) {
      console.log(`🔍 TAIWANGUN GEOCODING - ❌ ERROR:`, error);
    }
    
    return null;
  }
};
