
import { useEffect } from 'react';

export interface CountryCoordinates {
  [key: string]: [number, number];
}

export function useCountryCoordinates() {
  const countryCoordinates: CountryCoordinates = {
    France: [2.3522, 46.2276],
    Belgique: [4.3517, 50.8503],
    Suisse: [8.2275, 46.8182],
    Luxembourg: [6.1296, 49.8144],
    Allemagne: [10.4515, 51.1657],
    Espagne: [-3.7492, 40.4637],
    Italie: [12.5674, 41.8719]
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
