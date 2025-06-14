
import { CountryPattern, CountryCodeMapping } from './types';

// Fonction pour normaliser les chaînes en supprimant les accents et caractères spéciaux
const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD') // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprime les marques diacritiques
    .replace(/[łŁ]/g, 'l') // Remplacement spécifique pour le polonais
    .replace(/[żŻ]/g, 'z')
    .replace(/[ćĆ]/g, 'c')
    .replace(/[śŚ]/g, 's')
    .replace(/[ńŃ]/g, 'n')
    .replace(/[óÓ]/g, 'o')
    .replace(/[ąĄ]/g, 'a')
    .replace(/[ęĘ]/g, 'e');
};

// Enhanced country detection patterns including different alphabets and normalized versions
const COUNTRY_PATTERNS: CountryPattern[] = [
  // Taiwan patterns
  { keywords: ['taiwan', 'taipei', '台灣', '台北', '高雄', 'kaohsiung'], country: 'taiwan' },
  // Poland patterns - enhanced with normalized versions and more cities
  { 
    keywords: [
      'poland', 'polska', 'pologne',
      // Major cities with both original and normalized versions
      'warszawa', 'warsaw',
      'krakow', 'kraków', 'cracow', 'cracovie',
      'gdansk', 'gdańsk', 'danzig',
      'wroclaw', 'wrocław', 'breslau',
      'poznan', 'poznań',
      'lodz', 'łódź',
      'szczecin', 'katowice', 'bydgoszcz', 'lublin', 'bialystok', 'białystok',
      'czestochowa', 'częstochowa', 'radom', 'sosnowiec', 'torun', 'toruń',
      'kielce', 'gliwice', 'zabrze', 'bytom', 'olsztyn', 'rzeszow', 'rzeszów',
      'ruda', 'rybnik', 'tychy', 'gorzow', 'gorzów', 'elblag', 'elbląg',
      'opole', 'zielona', 'tarnow', 'tarnów', 'chorzow', 'chorzów',
      'koszalin', 'legnica', 'grudziadz', 'grudziądz', 'slupsk', 'słupsk',
      'jaworzno', 'jastrzebie', 'jastrzębie', 'nowy', 'jelenia', 'konin',
      'piotrkow', 'piotrków', 'inowroclaw', 'inowrocław', 'lubin', 'ostrow', 'ostrów',
      // Polish postal codes pattern (XX-XXX)
      '30-740', '31-', '32-', '33-', '34-', '80-', '81-', '82-', '00-', '01-', '02-'
    ], 
    country: 'poland' 
  },
  // Germany patterns
  { keywords: ['germany', 'deutschland', 'berlin', 'münchen', 'munich', 'hamburg', 'köln', 'cologne', 'frankfurt', 'stuttgart', 'düsseldorf', 'dortmund', 'essen', 'leipzig', 'bremen', 'dresden', 'hannover', 'nürnberg', 'nuremberg'], country: 'germany' },
  // Belgium patterns
  { keywords: ['belgium', 'belgique', 'belgië', 'brussels', 'bruxelles', 'brussel', 'antwerp', 'anvers', 'antwerpen', 'gent', 'gand', 'charleroi', 'liège', 'luik', 'bruges', 'brugge', 'namur', 'namen', 'leuven', 'louvain', 'mons', 'bergen'], country: 'belgium' },
  // Switzerland patterns
  { keywords: ['switzerland', 'suisse', 'schweiz', 'svizzera', 'bern', 'berne', 'zürich', 'zurich', 'genève', 'geneva', 'genf', 'basel', 'bâle', 'lausanne', 'winterthur', 'lucerne', 'luzern', 'st. gallen', 'sankt gallen'], country: 'switzerland' },
  // Spain patterns
  { keywords: ['spain', 'españa', 'espagne', 'madrid', 'barcelona', 'valencia', 'sevilla', 'seville', 'zaragoza', 'malaga', 'málaga', 'murcia', 'palma', 'las palmas', 'bilbao', 'alicante', 'cordoba', 'córdoba', 'valladolid', 'vigo', 'gijon', 'gijón'], country: 'spain' },
  // Italy patterns
  { keywords: ['italy', 'italia', 'italie', 'roma', 'rome', 'milano', 'milan', 'napoli', 'naples', 'torino', 'turin', 'palermo', 'genova', 'genoa', 'bologna', 'firenze', 'florence', 'bari', 'catania', 'venezia', 'venice', 'verona', 'messina', 'padova', 'trieste'], country: 'italy' },
  // Luxembourg patterns
  { keywords: ['luxembourg', 'luxemburg', 'lëtzebuerg'], country: 'luxembourg' }
];

// Country name mapping for better geocoding
const COUNTRY_MAPPING: CountryCodeMapping = {
  'taiwan': 'Taiwan',
  'poland': 'Poland',
  'polska': 'Poland',
  'pologne': 'Poland',
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
  
  // Try to detect from address patterns with normalization
  const fullAddress = `${store?.address || ''} ${store?.city || ''} ${store?.zip_code || ''}`;
  const storeName = (store?.name || '');
  
  // Normalize both original and search text
  const normalizedAddress = normalizeString(fullAddress);
  const normalizedStoreName = normalizeString(storeName);
  
  console.log(`Detecting country for store: "${store?.name}", Address: "${fullAddress}", Normalized: "${normalizedAddress}"`);
  
  // Special check for Polish postal codes (XX-XXX format)
  const polishPostalCodeRegex = /\b\d{2}-\d{3}\b/;
  if (polishPostalCodeRegex.test(fullAddress)) {
    console.log('Polish postal code detected, setting country to Poland');
    return 'poland';
  }
  
  for (const pattern of COUNTRY_PATTERNS) {
    for (const keyword of pattern.keywords) {
      const normalizedKeyword = normalizeString(keyword);
      
      // Check both original and normalized versions
      if (fullAddress.toLowerCase().includes(keyword.toLowerCase()) || 
          storeName.toLowerCase().includes(keyword.toLowerCase()) ||
          normalizedAddress.includes(normalizedKeyword) ||
          normalizedStoreName.includes(normalizedKeyword)) {
        console.log(`Country detected: ${pattern.country} based on keyword: ${keyword} (normalized: ${normalizedKeyword})`);
        return pattern.country;
      }
    }
  }
  
  // Default to France if no specific country detected
  console.log('No specific country detected, defaulting to France');
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
