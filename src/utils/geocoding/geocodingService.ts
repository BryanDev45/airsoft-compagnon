
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

    console.log(`Geocoding address: "${cleanAddress}", City: "${cleanCity}", ZIP: "${cleanZipCode}", Country: "${mappedCountry}", Code: "${countryCode}"`);

    // Enhanced search strategies for better international coverage with different alphabets
    const searchQueries = [
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
    ];

    for (let i = 0; i < searchQueries.length; i++) {
      const query = searchQueries[i];
      console.log(`Geocoding attempt ${i + 1}/${searchQueries.length} with query: "${query}"`);
      
      // Enhanced URL with better parameters for international support
      const geocodingUrl = new URL('https://nominatim.openstreetmap.org/search');
      geocodingUrl.searchParams.set('format', 'json');
      geocodingUrl.searchParams.set('q', query);
      geocodingUrl.searchParams.set('limit', '10');
      geocodingUrl.searchParams.set('addressdetails', '1');
      geocodingUrl.searchParams.set('extratags', '1');
      geocodingUrl.searchParams.set('namedetails', '1');
      geocodingUrl.searchParams.set('accept-language', 'en,local');
      
      // Add country code filter if available
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
          continue;
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          // Enhanced result evaluation with better scoring for international addresses
          for (const result of data) {
            const { lat, lon, address: resultAddress, importance = 0 } = result;
            const coordinates: Coordinates = {
              longitude: parseFloat(lon),
              latitude: parseFloat(lat)
            };
            
            // Validate that the result is reasonable
            if (areCoordinatesValid(coordinates.latitude, coordinates.longitude)) {
              const resultCountry = (resultAddress?.country || '').toLowerCase();
              const expectedCountry = mappedCountry.toLowerCase();
              
              // Enhanced country validation
              const isCountryMatch = 
                resultCountry.includes(expectedCountry) || 
                expectedCountry.includes(resultCountry) || 
                !countryCode || // If no country code, be more lenient
                i >= searchQueries.length - 2; // For last resort queries, be more lenient
              
              // Enhanced city validation
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
                i === searchQueries.length - 1 || // Last query is just city
                i >= searchQueries.length - 2; // Be more lenient for fallback queries
              
              // Enhanced scoring system
              let score = importance;
              if (isCountryMatch) score += 0.3;
              if (isCityMatch) score += 0.3;
              if (resultAddress?.postcode === cleanZipCode) score += 0.2;
              if (i === 0) score += 0.1; // Bonus for most specific query
              
              console.log(`Geocoding result: Query="${query}", Score=${score.toFixed(2)}, Country="${resultAddress?.country}", City="${resultCity}", Coords=(${coordinates.latitude}, ${coordinates.longitude})`);
              
              // Accept result if it meets minimum criteria
              if ((isCountryMatch && isCityMatch) || score > 0.4 || i >= 2) {
                console.log(`✓ Geocoding successful with query: "${query}"`);
                return coordinates;
              }
            }
          }
        }
      } catch (fetchError) {
        console.warn(`Network error for geocoding query "${query}":`, fetchError);
      }
      
      // Add delay between requests to respect rate limits
      if (i < searchQueries.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 150));
      }
    }
    
    console.log(`❌ No valid geocoding results found for: Address="${cleanAddress}", City="${cleanCity}", ZIP="${cleanZipCode}", Country="${mappedCountry}"`);
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};
