
import { Coordinates } from './types';
import { detectCountryFromStore, getMappedCountryName, getCountryCode } from './countryDetection';
import { areCoordinatesValid } from './coordinatesValidation';

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
    const cleanAddress = address.replace(/,\s*$/, '').trim();
    const cleanCity = city.replace(/,\s*$/, '').trim();
    
    const mappedCountry = getMappedCountryName(detectedCountry);

    // Enhanced search strategies for better international coverage with different alphabets
    const searchQueries = [
      // Most specific first with cleaned data
      `${cleanAddress}, ${zipCode} ${cleanCity}, ${mappedCountry}`,
      // Without zip code for international addresses
      `${cleanAddress}, ${cleanCity}, ${mappedCountry}`,
      // Just city and country as fallback
      `${cleanCity}, ${mappedCountry}`,
      // Store name + city + country for better recognition
      ...(storeData?.name ? [`${storeData.name}, ${cleanCity}, ${mappedCountry}`] : []),
      // City only as last resort
      cleanCity
    ];

    for (const query of searchQueries) {
      console.log('Geocoding attempt with query:', query, 'for store:', storeData?.name);
      
      // Enhanced URL with better parameters for international support
      const geocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1&extratags=1&namedetails=1&accept-language=en,local&countrycodes=${getCountryCode(mappedCountry)}`;
      
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
        // Enhanced result evaluation with better scoring for international addresses
        for (const result of data) {
          const { lat, lon, address: resultAddress } = result;
          const coordinates: Coordinates = {
            longitude: parseFloat(lon),
            latitude: parseFloat(lat)
          };
          
          // Validate that the result is reasonable and in the right country
          if (areCoordinatesValid(coordinates.latitude, coordinates.longitude)) {
            const resultCountry = resultAddress?.country?.toLowerCase() || '';
            const expectedCountry = mappedCountry.toLowerCase();
            
            // Enhanced country validation including exact matches and partial matches
            const isCountryMatch = resultCountry.includes(expectedCountry) || 
                                 expectedCountry.includes(resultCountry) || 
                                 query === cleanCity ||
                                 (storeData?.name && query.includes(storeData.name));
            
            // Additional validation for city names in different languages
            const resultCity = (resultAddress?.city || resultAddress?.town || resultAddress?.village || '').toLowerCase();
            const isCityMatch = resultCity.includes(cleanCity.toLowerCase()) || 
                              cleanCity.toLowerCase().includes(resultCity) ||
                              query === cleanCity;
            
            if (isCountryMatch && (isCityMatch || query === cleanCity)) {
              console.log('Geocoding successful with query:', query, 'Result:', coordinates, 'Country:', resultAddress?.country, 'City:', resultCity);
              return coordinates;
            }
          }
        }
      }
      
      // Add delay between requests to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('No valid geocoding results found for:', { address, zipCode, city, country: mappedCountry, detectedCountry });
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};
