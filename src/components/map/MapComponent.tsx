
import React, { useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Circle from 'ol/geom/Circle';

interface MapComponentProps {
  searchCenter: [number, number];
  searchRadius: number;
  filteredEvents: any[];
}

const MapComponent: React.FC<MapComponentProps> = ({ searchCenter, searchRadius, filteredEvents }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create events markers
    const features = filteredEvents.map(event => {
      return new Feature({
        geometry: new Point(fromLonLat([event.lng, event.lat]))
      });
    });

    // Create search radius circle if radius > 0
    if (searchRadius > 0) {
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

      features.push(radiusFeature);
    }

    const vectorSource = new VectorSource({
      features: features
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#ea384c'
          }),
          stroke: new Stroke({
            color: '#ffffff',
            width: 2
          })
        })
      })
    });

    // Initialize map
    map.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat(searchCenter),
        zoom: 6
      })
    });

    return () => {
      if (map.current) {
        map.current.setTarget(undefined);
        map.current = null;
      }
    };
  }, [searchCenter, searchRadius, filteredEvents]);

  return (
    <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden">
      {!map.current && (
        <div className="absolute inset-0 flex items-center justify-center flex-col bg-gray-200 z-10">
          <MapPin size={24} className="text-gray-400 mb-2" />
          <p className="text-center text-gray-500">Chargement de la carte...</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
