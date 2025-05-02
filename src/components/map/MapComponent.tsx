
import React, { useRef, useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, transform } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Circle from 'ol/geom/Circle';
import Overlay from 'ol/Overlay';
import MapMarker from './MapMarker';

interface MapComponentProps {
  searchCenter: [number, number];
  searchRadius: number;
  filteredEvents: any[];
}

const MapComponent: React.FC<MapComponentProps> = ({ searchCenter, searchRadius, filteredEvents }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const [view, setView] = useState<View | null>(null);

  useEffect(() => {
    if (!mapRef.current || !popupRef.current) return;

    // Create popup overlay
    overlayRef.current = new Overlay({
      element: popupRef.current,
      autoPan: {
        animation: {
          duration: 250
        }
      }
    });

    // Create event markers with custom style
    const features = filteredEvents.map(event => {
      // Make sure we're using the correct coordinates for the game
      const feature = new Feature({
        geometry: new Point(fromLonLat([event.lng || 0, event.lat || 0])),
        event: event,
      });

      feature.setStyle(new Style({
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({
            color: '#ea384c'
          }),
          stroke: new Stroke({
            color: '#ffffff',
            width: 3
          })
        })
      }));

      return feature;
    });

    // Create search radius circle
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
      source: vectorSource
    });

    const newView = new View({
      center: fromLonLat(searchCenter),
      zoom: 6
    });

    setView(newView);

    // Initialize map
    map.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: newView
    });

    map.current.addOverlay(overlayRef.current);

    // Click handler for markers
    map.current.on('click', (event) => {
      const feature = map.current?.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      
      if (feature && feature.get('event')) {
        const coordinates = (feature.getGeometry() as Point).getCoordinates();
        const event = feature.get('event');
        
        setSelectedEvent(event);
        overlayRef.current?.setPosition(coordinates);
      } else {
        setSelectedEvent(null);
        overlayRef.current?.setPosition(undefined);
      }
    });

    // Set map as loaded when rendered
    map.current.once('rendercomplete', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.setTarget(undefined);
      map.current = null;
    };
  }, [searchCenter, searchRadius, filteredEvents]);

  // Update view when center changes
  useEffect(() => {
    if (view && map.current) {
      view.animate({
        center: fromLonLat(searchCenter),
        duration: 1000,
        zoom: searchRadius > 0 ? 12 : 6
      });
    }
  }, [searchCenter, searchRadius, view]);

  return (
    <div ref={mapRef} className="w-full h-full rounded-lg overflow-hidden relative">
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center flex-col bg-gray-200 z-10">
          <MapPin size={24} className="text-gray-400 mb-2" />
          <p className="text-center text-gray-500">Chargement de la carte...</p>
        </div>
      )}
      <div ref={popupRef} className="absolute z-50">
        {selectedEvent && (
          <MapMarker 
            event={selectedEvent} 
            onClose={() => {
              setSelectedEvent(null);
              overlayRef.current?.setPosition(undefined);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MapComponent;
