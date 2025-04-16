
import React, { useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';

interface LocationMapProps {
  location: string;
  coordinates?: [number, number]; // Optional explicit coordinates
}

const LocationMap: React.FC<LocationMapProps> = ({ location, coordinates = [2.3522, 48.8566] }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || map.current) return;

    // Create marker for the location
    const marker = new Feature({
      geometry: new Point(fromLonLat(coordinates))
    });

    marker.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/geo-alt-fill.svg',
          scale: 1.5,
          color: '#ea384c'
        })
      })
    );

    const vectorSource = new VectorSource({
      features: [marker]
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    map.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat(coordinates),
        zoom: 15
      }),
      controls: []
    });

    return () => {
      if (map.current) {
        map.current.setTarget(null);
        map.current = null;
      }
    };
  }, [coordinates]);

  return (
    <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden">
      {!map.current && (
        <div className="absolute inset-0 flex items-center justify-center flex-col bg-gray-200">
          <MapPin size={24} className="text-gray-400 mb-2" />
          <p className="text-center text-gray-500">Chargement de la carte...</p>
        </div>
      )}
    </div>
  );
};

export default LocationMap;
