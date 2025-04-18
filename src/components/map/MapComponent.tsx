
import React, { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon, Circle, Fill, Stroke } from 'ol/style';
import { MapPin } from 'lucide-react';

interface MapComponentProps {
  searchCenter: [number, number];
  searchRadius: number;
  filteredEvents: any[];
}

const MapComponent: React.FC<MapComponentProps> = ({ searchCenter, searchRadius, filteredEvents }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || map.current) return;

    // Create markers for events
    const markers = filteredEvents.map(event => {
      const marker = new Feature({
        geometry: new Point(fromLonLat([event.lng, event.lat]))
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

      return marker;
    });

    // Create search radius circle if radius > 0
    let searchCircle;
    if (searchRadius > 0) {
      searchCircle = new Feature({
        geometry: new Point(fromLonLat(searchCenter))
      });

      searchCircle.setStyle(
        new Style({
          image: new Circle({
            radius: searchRadius * 1000, // Convert km to meters
            fill: new Fill({
              color: 'rgba(234, 56, 76, 0.1)'
            }),
            stroke: new Stroke({
              color: '#ea384c',
              width: 2
            })
          })
        })
      );

      markers.push(searchCircle);
    }

    const vectorSource = new VectorSource({
      features: markers
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
        center: fromLonLat(searchCenter),
        zoom: 6
      })
    });

    return () => {
      if (map.current) {
        map.current.setTarget(null);
        map.current = null;
      }
    };
  }, [searchCenter, searchRadius, filteredEvents]);

  return (
    <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden">
      {!map.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center text-gray-500">
            <MapPin className="w-8 h-8 mx-auto mb-2" />
            <p>Carte interactive en cours de chargement...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
