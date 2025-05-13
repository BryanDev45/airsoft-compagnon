
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
import { Style, Icon, Fill, Stroke, Circle as CircleStyle } from 'ol/style';

interface LocationMapProps {
  location: string;
  coordinates: [number, number]; // Les coordonnées sont obligatoires maintenant
}

const LocationMap: React.FC<LocationMapProps> = ({ location, coordinates }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstance = useRef<Map | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Créer la carte une seule fois au chargement initial
  useEffect(() => {
    if (!mapRef.current || initialized) return;

    // Assurons-nous que les coordonnées sont bien des nombres
    const lng = typeof coordinates[0] === 'number' ? coordinates[0] : parseFloat(String(coordinates[0]));
    const lat = typeof coordinates[1] === 'number' ? coordinates[1] : parseFloat(String(coordinates[1]));

    // Vérifier que les coordonnées sont valides
    const validCoordinates = !isNaN(lng) && !isNaN(lat);
    const mapCoordinates = validCoordinates ? [lng, lat] : [2.3522, 48.8566]; // Paris par défaut si invalide

    // Créer un marqueur pour l'emplacement avec un style amélioré
    const marker = new Feature({
      geometry: new Point(fromLonLat(mapCoordinates))
    });

    // Style plus visible pour le marqueur avec un cercle d'ombre
    marker.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 12,
          fill: new Fill({
            color: 'rgba(234, 56, 76, 0.2)'
          }),
          stroke: new Stroke({
            color: '#ea384c',
            width: 2
          })
        })
      })
    );

    // Ajouter un second marqueur au dessus avec l'icône
    const pinMarker = new Feature({
      geometry: new Point(fromLonLat(mapCoordinates))
    });

    pinMarker.setStyle(
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
      features: [marker, pinMarker]
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      zIndex: 1
    });

    // Fix: Make sure to properly initialize the map with the OSM layer first, then add vector layer
    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
          zIndex: 0
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat(mapCoordinates),
        zoom: 15,
        maxZoom: 19,
        minZoom: 3
      }),
      controls: [] // Désactiver les contrôles par défaut pour une UI plus propre
    });

    // Marquer la carte comme chargée une fois qu'elle est rendue
    mapInstance.current.once('rendercomplete', () => {
      setMapLoaded(true);
      setInitialized(true);
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
        mapInstance.current = null;
      }
    };
  }, []);

  // Uniquement mettre à jour la vue et le marqueur lorsque les coordonnées changent
  useEffect(() => {
    if (!mapInstance.current || !initialized) return;

    // Assurons-nous que les coordonnées sont bien des nombres
    const lng = typeof coordinates[0] === 'number' ? coordinates[0] : parseFloat(String(coordinates[0]));
    const lat = typeof coordinates[1] === 'number' ? coordinates[1] : parseFloat(String(coordinates[1]));

    // Vérifier que les coordonnées sont valides
    const validCoordinates = !isNaN(lng) && !isNaN(lat);
    if (!validCoordinates) return;

    const mapCoordinates = [lng, lat];
    
    // Mettre à jour la position du centre de la vue
    const view = mapInstance.current.getView();
    view.setCenter(fromLonLat(mapCoordinates));
    
    // Mettre à jour la position des marqueurs
    const vectorLayers = mapInstance.current.getLayers().getArray().filter(
      layer => layer instanceof VectorLayer
    ) as VectorLayer<VectorSource>[];
    
    if (vectorLayers.length > 0) {
      const vectorSource = vectorLayers[0].getSource();
      const features = vectorSource?.getFeatures();
      
      if (features && features.length) {
        features.forEach(feature => {
          const geometry = feature.getGeometry();
          if (geometry && geometry instanceof Point) {
            geometry.setCoordinates(fromLonLat(mapCoordinates));
          }
        });
      }
    }
  }, [coordinates, initialized]);

  return (
    <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden relative">
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center flex-col bg-gray-100 z-10" style={{ pointerEvents: 'none' }}>
          <div className="animate-pulse">
            <MapPin size={32} className="text-airsoft-red mb-2" />
          </div>
          <p className="text-center text-gray-500 font-medium">Chargement de la carte...</p>
        </div>
      )}
      
      {/* Indication de l'adresse sur la carte */}
      {mapLoaded && location && (
        <div className="absolute bottom-3 left-3 bg-white bg-opacity-85 py-2 px-3 rounded shadow-md z-20 text-sm flex items-center max-w-[80%]">
          <MapPin size={14} className="text-airsoft-red mr-1 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      )}
    </div>
  );
};

export default LocationMap;
