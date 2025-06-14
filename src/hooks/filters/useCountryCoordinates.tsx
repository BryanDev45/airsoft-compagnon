
import { useEffect } from 'react';

export interface CountryCoordinates {
  [key: string]: [number, number];
}

export function useCountryCoordinates() {
  const countryCoordinates: CountryCoordinates = {
    // Europe
    France: [2.3522, 46.2276],
    Belgique: [4.3517, 50.8503],
    Suisse: [8.2275, 46.8182],
    Luxembourg: [6.1296, 49.8144],
    Allemagne: [10.4515, 51.1657],
    Espagne: [-3.7492, 40.4637],
    Italie: [12.5674, 41.8719],
    'Pays-Bas': [5.2913, 52.1326],
    Portugal: [-8.2245, 39.3999],
    Autriche: [14.5501, 47.5162],
    'République tchèque': [15.4729, 49.8175],
    Pologne: [19.1343, 51.9194],
    Hongrie: [19.5033, 47.1625],
    Slovaquie: [19.6990, 48.6690],
    Slovénie: [14.9955, 46.1512],
    Croatie: [15.2000, 45.1000],
    'Bosnie-Herzégovine': [17.6791, 43.9159],
    Serbie: [21.0059, 44.0165],
    Monténégro: [19.3744, 42.7087],
    'Macédoine du Nord': [21.7453, 41.6086],
    Albanie: [20.1683, 41.1533],
    Grèce: [21.8243, 39.0742],
    Bulgarie: [25.4858, 42.7339],
    Roumanie: [24.9668, 45.9432],
    Ukraine: [31.1656, 48.3794],
    Moldavie: [28.3699, 47.4116],
    Biélorussie: [27.9534, 53.7098],
    Lituanie: [23.8813, 55.1694],
    Lettonie: [24.6032, 56.8796],
    Estonie: [25.0136, 58.5953],
    Finlande: [25.7482, 61.9241],
    Suède: [18.6435, 60.1282],
    Norvège: [8.4689, 60.4720],
    Danemark: [9.5018, 56.2639],
    Islande: [-19.0208, 64.9631],
    Irlande: [-8.2439, 53.4129],
    'Royaume-Uni': [-3.4360, 55.3781],
    Russie: [105.3188, 61.5240],
    
    // Amérique du Nord
    'États-Unis': [-95.7129, 37.0902],
    Canada: [-106.3468, 56.1304],
    Mexique: [-102.5528, 23.6345],
    
    // Amérique du Sud
    Brésil: [-51.9253, -14.2350],
    Argentine: [-63.6167, -38.4161],
    Chili: [-71.5430, -35.6751],
    Pérou: [-75.0152, -9.1900],
    Colombie: [-74.2973, 4.5709],
    Venezuela: [-66.5897, 6.4238],
    Équateur: [-78.1834, -1.8312],
    Bolivie: [-63.5887, -16.2902],
    Paraguay: [-58.4438, -23.4425],
    Uruguay: [-55.7658, -32.5228],
    Guyane: [-58.9302, 4.8604],
    Suriname: [-56.0277, 3.9193],
    'Guyane française': [-53.1258, 3.9339],
    
    // Asie
    Chine: [104.1954, 35.8617],
    Japon: [138.2529, 36.2048],
    'Corée du Sud': [127.7669, 35.9078],
    'Corée du Nord': [127.5101, 40.3399],
    Inde: [78.9629, 20.5937],
    Indonésie: [113.9213, -0.7893],
    Thaïlande: [100.9925, 15.8700],
    Vietnam: [108.2772, 14.0583],
    Philippines: [121.7740, 12.8797],
    Malaisie: [101.9758, 4.2105],
    Singapour: [103.8198, 1.3521],
    'Arabie saoudite': [45.0792, 23.8859],
    Iran: [53.6880, 32.4279],
    Irak: [43.6793, 33.2232],
    Turquie: [35.2433, 38.9637],
    Israël: [34.8516, 32.0853],
    Jordanie: [36.2384, 30.5852],
    Liban: [35.8623, 33.8547],
    Syrie: [38.9968, 34.8021],
    
    // Afrique
    'Afrique du Sud': [22.9375, -30.5595],
    Égypte: [30.8025, 26.8206],
    Nigeria: [8.6753, 9.0820],
    Kenya: [37.9062, -0.0236],
    Éthiopie: [40.4897, 9.1450],
    Ghana: [-1.0232, 7.9465],
    'Côte d\'Ivoire': [-5.5471, 7.5400],
    Maroc: [-7.0926, 31.7917],
    Algérie: [1.6596, 28.0339],
    Tunisie: [9.5375, 33.8869],
    Libye: [17.2283, 26.3351],
    Soudan: [30.2176, 12.8628],
    Tanzanie: [34.8888, -6.3690],
    Ouganda: [32.2903, 1.3733],
    
    // Océanie
    Australie: [133.7751, -25.2744],
    'Nouvelle-Zélande': [174.8860, -40.9006],
    'Papouasie-Nouvelle-Guinée': [143.9555, -6.3149],
    Fidji: [179.4144, -16.5780]
  };

  const updateSearchCenterForCountry = (
    selectedCountry: string,
    setSearchCenter: (center: [number, number]) => void
  ) => {
    if (selectedCountry !== 'all' && countryCoordinates[selectedCountry]) {
      setSearchCenter(countryCoordinates[selectedCountry]);
    }
  };

  return {
    countryCoordinates,
    updateSearchCenterForCountry
  };
}
