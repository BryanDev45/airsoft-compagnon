
import React, { useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Style, Icon } from 'ol/style';
import 'ol/ol.css';
import { MapEvent, MapStore } from '@/hooks/useMapData';

interface MapComponentProps {
  events?: MapEvent[];
  stores?: MapStore[];
  selectedCategory?: string;
  centerCoordinates?: [number, number] | null;
  searchCenter?: [number, number];
  searchRadius?: number;
  filteredEvents?: MapEvent[];
  onEventClick?: (event: MapEvent) => void;
  onStoreClick?: (store: MapStore) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  events = [],
  stores = [],
  selectedCategory = 'all',
  centerCoordinates,
  searchCenter,
  filteredEvents = [],
  onEventClick,
  onStoreClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const vectorLayerRef = useRef<VectorLayer<VectorSource> | null>(null);

  // Use filteredEvents if provided, otherwise use events
  const eventsToShow = filteredEvents.length > 0 ? filteredEvents : events;
  // Use searchCenter if provided, otherwise use centerCoordinates
  const mapCenter = searchCenter || centerCoordinates || [2.3522, 48.8566];

  // Initialisation de la carte
  useEffect(() => {
    if (!mapRef.current) return;

    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    vectorLayerRef.current = vectorLayer;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat(mapCenter), // Paris par défaut
        zoom: mapCenter !== [2.3522, 48.8566] ? 10 : 6,
      }),
    });

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      map.setTarget(undefined);
    };
  }, []);

  // Mise à jour du centre de la carte
  useEffect(() => {
    if (mapInstanceRef.current && mapCenter) {
      const view = mapInstanceRef.current.getView();
      view.setCenter(fromLonLat(mapCenter));
      view.setZoom(10);
    }
  }, [mapCenter]);

  // Mise à jour des marqueurs
  useEffect(() => {
    if (!vectorLayerRef.current) return;

    const vectorSource = vectorLayerRef.current.getSource();
    if (!vectorSource) return;

    // Effacer les marqueurs existants
    vectorSource.clear();

    // Ajouter les marqueurs d'événements
    if (selectedCategory === 'all' || selectedCategory === 'parties') {
      eventsToShow.forEach((event) => {
        if (event.lat && event.lng) {
          const feature = new Feature({
            geometry: new Point(fromLonLat([event.lng, event.lat])),
            data: { type: 'event', ...event },
          });

          feature.setStyle(
            new Style({
              image: new Icon({
                anchor: [0.5, 1],
                src: '/lovable-uploads/dabf8bbc-44a7-4c03-bebe-009592f0c6c8.png',
                scale: 0.05,
              }),
            })
          );

          vectorSource.addFeature(feature);
        }
      });
    }

    // Ajouter les marqueurs de magasins
    if (selectedCategory === 'all' || selectedCategory === 'stores') {
      stores.forEach((store) => {
        if (store.lat && store.lng) {
          const feature = new Feature({
            geometry: new Point(fromLonLat([store.lng, store.lat])),
            data: { type: 'store', ...store },
          });

          feature.setStyle(
            new Style({
              image: new Icon({
                anchor: [0.5, 1],
                src: '/lovable-uploads/52a37106-d8af-4a71-9d67-4d69bd884c8f.png',
                scale: 0.05,
              }),
            })
          );

          vectorSource.addFeature(feature);
        }
      });
    }

    // Gestionnaire de clic sur les marqueurs
    const handleMapClick = (evt: any) => {
      if (!mapInstanceRef.current) return;

      mapInstanceRef.current.forEachFeatureAtPixel(evt.pixel, (feature) => {
        const data = feature.get('data');
        if (data?.type === 'event' && onEventClick) {
          onEventClick(data);
        } else if (data?.type === 'store' && onStoreClick) {
          onStoreClick(data);
        }
      });
    };

    if (mapInstanceRef.current) {
      mapInstanceRef.current.on('click', handleMapClick);

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.un('click', handleMapClick);
        }
      };
    }
  }, [eventsToShow, stores, selectedCategory, onEventClick, onStoreClick]);

  return <div ref={mapRef} className="w-full h-full" />;
};

export default MapComponent;
