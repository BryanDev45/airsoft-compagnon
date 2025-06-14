
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Circle from 'ol/geom/Circle';
import { fromLonLat } from 'ol/proj';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { MapEvent, MapStore } from '@/hooks/useGamesData';
import { areCoordinatesValid } from '@/utils/geocodingUtils';

export const createEventFeatures = (filteredEvents: MapEvent[]): Feature[] => {
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
      const feature = new Feature({
        geometry: new Point(fromLonLat([lng, lat])),
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

  return features;
};

export const createStoreFeatures = (stores: MapStore[]): Feature[] => {
  const features: Feature[] = [];

  stores.forEach(store => {
    const lat = parseFloat(String(store.lat)) || 0;
    const lng = parseFloat(String(store.lng)) || 0;
    
    if (!areCoordinatesValid(lat, lng)) {
      console.warn(`Skipping store "${store.name}" with invalid coordinates: (${lat}, ${lng})`);
      return;
    }

    console.log(`Adding store marker for "${store.name}" at (${lat}, ${lng})`);
    
    const feature = new Feature({
      geometry: new Point(fromLonLat([lng, lat])),
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
  });

  return features;
};

export const createSearchRadiusFeature = (
  searchCenter: [number, number], 
  searchRadius: number
): Feature | null => {
  if (searchRadius <= 0) return null;

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

  return radiusFeature;
};
