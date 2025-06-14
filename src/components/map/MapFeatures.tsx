import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Circle from 'ol/geom/Circle';
import { fromLonLat } from 'ol/proj';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { MapEvent } from '@/hooks/useGamesData';
import { MapStore } from '@/hooks/stores/types';
import { areCoordinatesValid } from '@/utils/geocodingUtils';

export const createEventFeatures = (filteredEvents: MapEvent[]): Feature[] => {
  console.log(`MapFeatures: Creating event features for ${filteredEvents.length} events`);
  const features: Feature[] = [];

  filteredEvents.forEach(event => {
    const lat = Number(event.lat);
    const lng = Number(event.lng);
    
    console.log(`MapFeatures: Processing event "${event.title}" with coordinates (${lat}, ${lng})`);
    
    if (!areCoordinatesValid(lat, lng)) {
      console.warn(`MapFeatures: Skipping event "${event.title}" with invalid coordinates: (${lat}, ${lng})`);
      return;
    }

    console.log(`MapFeatures: Adding marker for event "${event.title}" at coordinates (${lat}, ${lng})`);
    
    try {
      const coords = fromLonLat([lng, lat]);
      console.log(`MapFeatures: Transformed coordinates for "${event.title}": ${coords}`);
      
      const feature = new Feature({
        geometry: new Point(coords),
        event: event,
        type: 'event'
      });

      feature.setStyle(new Style({
        image: new CircleStyle({
          radius: 10,
          fill: new Fill({
            color: '#ea384c'
          }),
          stroke: new Stroke({
            color: '#ffffff',
            width: 3
          })
        })
      }));

      features.push(feature);
      console.log(`MapFeatures: Successfully added marker for event "${event.title}"`);
    } catch (error) {
      console.error(`MapFeatures: Error creating marker for event "${event.title}":`, error);
    }
  });

  console.log(`MapFeatures: Created ${features.length} event features`);
  return features;
};

export const createStoreFeatures = (stores: MapStore[]): Feature[] => {
  console.log(`MapFeatures: Creating store features for ${stores.length} stores`);
  const features: Feature[] = [];

  stores.forEach(store => {
    const lat = parseFloat(String(store.lat)) || 0;
    const lng = parseFloat(String(store.lng)) || 0;
    const isTaiwangun = store.name.toLowerCase().includes('taiwangun');
    
    if (isTaiwangun) {
      console.log(`🔍 TAIWANGUN DEBUG - Creating map feature:`, {
        name: store.name,
        coordinates: { lat, lng },
        originalCoords: { lat: store.lat, lng: store.lng }
      });
    }
    
    console.log(`MapFeatures: Processing store "${store.name}" with coordinates (${lat}, ${lng})`);
    
    if (!areCoordinatesValid(lat, lng)) {
      console.warn(`MapFeatures: Skipping store "${store.name}" with invalid coordinates: (${lat}, ${lng})`);
      if (isTaiwangun) {
        console.log(`🔍 TAIWANGUN DEBUG - Store coordinates are invalid!`);
      }
      return;
    }

    console.log(`MapFeatures: Adding store marker for "${store.name}" at (${lat}, ${lng})`);
    
    try {
      const coords = fromLonLat([lng, lat]);
      
      if (isTaiwangun) {
        console.log(`🔍 TAIWANGUN DEBUG - Transformed OpenLayers coordinates:`, coords);
      }
      
      console.log(`MapFeatures: Transformed coordinates for "${store.name}": ${coords}`);
      
      const feature = new Feature({
        geometry: new Point(coords),
        store: store,
        type: 'store'
      });

      feature.setStyle(new Style({
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({
            color: '#10b981'
          }),
          stroke: new Stroke({
            color: '#ffffff',
            width: 3
          })
        })
      }));

      features.push(feature);
      
      if (isTaiwangun) {
        console.log(`🔍 TAIWANGUN DEBUG - Successfully created map feature`);
      }
      
      console.log(`MapFeatures: Successfully added store marker for "${store.name}"`);
    } catch (error) {
      console.error(`MapFeatures: Error creating store marker for "${store.name}":`, error);
      if (isTaiwangun) {
        console.log(`🔍 TAIWANGUN DEBUG - Error creating map feature:`, error);
      }
    }
  });

  console.log(`MapFeatures: Created ${features.length} store features`);
  
  // Log if Taiwangun feature was created
  const taiwangunFeature = features.find(f => f.get('store')?.name?.toLowerCase().includes('taiwangun'));
  if (taiwangunFeature) {
    console.log(`🔍 TAIWANGUN DEBUG - Taiwangun feature created successfully in features array`);
  } else {
    console.log(`🔍 TAIWANGUN DEBUG - Taiwangun feature NOT found in features array`);
  }
  
  return features;
};

export const createSearchRadiusFeature = (
  searchCenter: [number, number], 
  searchRadius: number
): Feature | null => {
  if (searchRadius <= 0) {
    console.log(`MapFeatures: No radius feature - radius is ${searchRadius}`);
    return null;
  }

  console.log(`MapFeatures: Creating radius feature with center ${searchCenter} and radius ${searchRadius}km`);

  const radiusFeature = new Feature({
    geometry: new Circle(fromLonLat(searchCenter), searchRadius * 1000)
  });

  radiusFeature.setStyle(
    new Style({
      stroke: new Stroke({
        color: 'rgba(234, 56, 76, 0.8)',
        width: 2
      }),
      fill: new Fill({
        color: 'rgba(234, 56, 76, 0.1)'
      })
    })
  );

  console.log(`MapFeatures: Created radius feature`);
  return radiusFeature;
};
