
import React, { useRef, useEffect, useState } from 'react';
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
  coordinates: [number, number]; // Les coordonnées sont obligatoires maintenant
}

const LocationMap: React.FC<LocationMapProps> = ({ location, coordinates }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || map.current) return;

    // Assurons-nous que les coordonnées sont bien des nombres
    const lng = typeof coordinates[0] === 'number' ? coordinates[0] : parseFloat(String(coordinates[0]));
    const lat = typeof coordinates[1] === 'number' ? coordinates[1] : parseFloat(String(coordinates[1]));

    // Vérifier que les coordonnées sont valides avant de créer la carte
    const validCoordinates = !isNaN(lng) && !isNaN(lat);
    const mapCoordinates = validCoordinates ? [lng, lat] : [2.3522, 48.8566]; // Paris par défaut si invalide

    // Créer un marqueur pour l'emplacement
    const marker = new Feature({
      geometry: new Point(fromLonLat(mapCoordinates))
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
        center: fromLonLat(mapCoordinates),
        zoom: 15
      }),
      controls: []
    });

    // Marquer la carte comme chargée une fois qu'elle est rendue
    map.current.once('rendercomplete', () => {
      setMapLoaded(true);
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
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center flex-col bg-gray-200 z-10" style={{ pointerEvents: 'none' }}>
          <MapPin size={24} className="text-gray-400 mb-2" />
          <p className="text-center text-gray-500">Chargement de la carte...</p>
        </div>
      )}
    </div>
  );
};

export default LocationMap;
