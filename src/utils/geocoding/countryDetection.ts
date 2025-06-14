
import { CountryPattern, CountryCodeMapping } from './types';

// Enhanced country detection patterns including different alphabets
const COUNTRY_PATTERNS: CountryPattern[] = [
  // Taiwan patterns
  { keywords: ['taiwan', 'taipei', '台灣', '台北', '高雄', 'kaohsiung'], country: 'taiwan' },
  // Poland patterns  
  { keywords: ['poland', 'polska', 'warszawa', 'kraków', 'gdańsk', 'wrocław'], country: 'poland' },
  // Germany patterns
  { keywords: ['germany', 'deutschland', 'berlin', 'münchen', 'hamburg', 'köln'], country: 'germany' },
  // Belgium patterns
  { keywords: ['belgium', 'belgique', 'belgië', 'brussels', 'bruxelles', 'brussel', 'antwerp', 'gent'], country: 'belgium' },
  // Switzerland patterns
  { keywords: ['switzerland', 'suisse', 'schweiz', 'svizzera', 'bern', 'zürich', 'genève', 'basel'], country: 'switzerland' },
  // Spain patterns
  { keywords: ['spain', 'españa', 'espagne', 'madrid', 'barcelona', 'valencia', 'sevilla'], country: 'spain' },
  // Italy patterns
  { keywords: ['italy', 'italia', 'italie', 'roma', 'milano', 'napoli', 'torino'], country: 'italy' },
  // Luxembourg patterns
  { keywords: ['luxembourg', 'luxemburg'], country: 'luxembourg' }
];

// Country name mapping for better geocoding
const COUNTRY_MAPPING: CountryCodeMapping = {
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
  'france': 'France',
  'luxembourg': 'Luxembourg'
};

// Country codes for Nominatim API
const COUNTRY_CODES: CountryCodeMapping = {
  'France': 'fr',
  'Belgium': 'be',
  'Switzerland': 'ch',
  'Germany': 'de',
  'Spain': 'es',
  'Italy': 'it',
  'Poland': 'pl',
  'Taiwan': 'tw',
  'Luxembourg': 'lu'
};

// Enhanced function to detect country from address or store info
export const detectCountryFromStore = (store: any): string => {
  // Check if store has country field
  if (store?.country) {
    return store.country.toLowerCase();
  }
  
  // Try to detect from address patterns
  const fullAddress = `${store?.address || ''} ${store?.city || ''}`.toLowerCase();
  const storeName = (store?.name || '').toLowerCase();
  
  for (const pattern of COUNTRY_PATTERNS) {
    for (const keyword of pattern.keywords) {
      if (fullAddress.includes(keyword) || storeName.includes(keyword)) {
        console.log(`Country detected: ${pattern.country} based on keyword: ${keyword}`);
        return pattern.country;
      }
    }
  }
  
  // Default to France if no specific country detected
  return 'france';
};

// Get mapped country name
export const getMappedCountryName = (country: string): string => {
  return COUNTRY_MAPPING[country.toLowerCase()] || country;
};

// Get country code for Nominatim API
export const getCountryCode = (country: string): string => {
  return COUNTRY_CODES[country] || '';
};
