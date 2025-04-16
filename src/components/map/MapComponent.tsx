
import React, { useState, useRef, useEffect } from 'react';
import { MapIcon } from 'lucide-react';
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
import Circle from 'ol/geom/Circle';
import { Style, Icon, Fill, Stroke } from 'ol/style';
import Overlay from 'ol/Overlay';

interface MapComponentProps {
  searchCenter: [number, number];
  searchRadius: number;
  filteredEvents: any[];
}

const MapComponent: React.FC<MapComponentProps> = ({ searchCenter, searchRadius, filteredEvents }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const searchCircleLayer = useRef<VectorLayer<VectorSource> | null>(null);
  const markersLayer = useRef<VectorLayer<VectorSource> | null>(null);
  const popupOverlay = useRef<Overlay | null>(null);

  // Initialize the map OpenLayers
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Create popup overlay for marker info
    const container = document.createElement('div');
    container.className = 'ol-popup bg-white p-4 rounded-lg shadow-xl text-sm max-w-xs';
    const overlay = new Overlay({
      element: container,
      autoPan: true,
      // Fix for autoPanAnimation typing issue
      autoPanAnimation: {
        duration: 250
      } as any
    });
    popupOverlay.current = overlay;

    // Create the map
    map.current = new Map({
      target: mapContainer.current,
      layers: [new TileLayer({
        source: new OSM()
      })],
      view: new View({
        center: fromLonLat(searchCenter),
        zoom: 5
      }),
      controls: []
    });

    // Add the popup overlay to the map
    map.current.addOverlay(overlay);

    // Add click event handler for markers
    map.current.on('click', function (evt) {
      const feature = map.current?.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
      });
      
      if (feature) {
        // Fix for getCoordinates typing issue
        const coordinates = (feature.getGeometry() as Point).getCoordinates();
        if (coordinates) {
          const eventId = feature.get('id');
          const eventType = feature.get('type');
          
          container.innerHTML = `
            <div class="font-semibold text-lg text-airsoft-red mb-2">${feature.get('name')}</div>
            <div class="mb-1"><span class="font-medium">Lieu:</span> ${feature.get('location')}</div>
            <div class="mb-1"><span class="font-medium">Date:</span> ${feature.get('date')}</div>
            <div class="mb-1"><span class="font-medium">Type:</span> ${eventType === 'cqb' ? 'CQB' : 
              eventType === 'milsim' ? 'Milsim' : 
              eventType === 'woodland' ? 'Woodland' : 
              eventType === 'speedsoft' ? 'Speedsoft' : 
              eventType === 'tournament' ? 'Tournoi' : eventType}</div>
            <div class="mb-3"><span class="font-medium">Département:</span> ${feature.get('department')}</div>
            <a href="/game/${eventId}" class="bg-airsoft-red text-white px-3 py-1 rounded text-sm inline-block hover:bg-red-700">
              Plus d'informations
            </a>
          `;
          
          // Fix for optional property access issue
          if (overlay) {
            overlay.setPosition(coordinates);
          }
        }
      } else {
        if (overlay) {
          overlay.setPosition(undefined);
        }
      }
    });

    // Change cursor when hovering over markers
    map.current.on('pointermove', function (e) {
      const pixel = map.current?.getEventPixel(e.originalEvent);
      if (pixel && map.current) {
        const hit = map.current.hasFeatureAtPixel(pixel);
        map.current.getTargetElement().style.cursor = hit ? 'pointer' : '';
      }
    });

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.setTarget(null);
        map.current = null;
      }
    };
  }, []);

  // Function to update the search circle on the map
  const updateSearchCircle = (center: [number, number], radiusKm: number) => {
    if (!map.current) return;
    
    // Remove any existing search circle layer
    if (searchCircleLayer.current) {
      map.current.removeLayer(searchCircleLayer.current);
      searchCircleLayer.current = null;
    }
    
    // If radius is 0, don't show the circle
    if (radiusKm === 0) return;
    
    // Calculate radius in meters (OL uses meters)
    const radiusMeters = radiusKm * 1000;
    
    // Create center point in EPSG:3857 (Web Mercator)
    const centerPoint = fromLonLat(center);
    
    // Create a circle feature with proper radius
    const circle = new Circle(centerPoint, radiusMeters);
    const circleFeature = new Feature(circle);
    
    // Create vector source with the circle feature
    const vectorSource = new VectorSource({
      features: [circleFeature]
    });
    
    // Create vector layer with style
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(234, 56, 76, 0.8)',
          width: 2
        }),
        fill: new Fill({
          color: 'rgba(234, 56, 76, 0.1)'
        })
      }),
      zIndex: 1 // Lower zIndex so markers appear above
    });
    
    // Add to map
    map.current.addLayer(vectorLayer);
    searchCircleLayer.current = vectorLayer;
  };

  // Update markers on the map
  const updateMarkers = () => {
    if (!map.current) return;
    
    // Remove existing markers layer if it exists
    if (markersLayer.current) {
      map.current.removeLayer(markersLayer.current);
      markersLayer.current = null;
    }
    
    // Create a new vector source for markers
    const vectorSource = new VectorSource();
    
    // Add markers for filtered events
    filteredEvents.forEach(event => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([event.lng, event.lat])),
        name: event.title,
        location: event.location,
        date: event.date,
        type: event.type,
        department: event.department,
        id: event.id
      });
      
      vectorSource.addFeature(feature);
    });
    
    // Create a new vector layer with the markers
    const newMarkersLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/geo-alt-fill.svg',
          scale: 1.5,
          color: '#ea384c'
        })
      }),
      zIndex: 2 // Higher zIndex to ensure markers are on top
    });
    
    // Add the new markers layer to the map
    map.current.addLayer(newMarkersLayer);
    markersLayer.current = newMarkersLayer;
  };

  // Update view when search center changes
  useEffect(() => {
    if (map.current && searchCenter) {
      map.current.getView().animate({
        center: fromLonLat(searchCenter),
        zoom: searchRadius === 0 ? 5 : 10,
        duration: 1000
      });
      
      // Update search circle if radius > 0
      if (searchRadius > 0) {
        updateSearchCircle(searchCenter, searchRadius);
      } else if (searchCircleLayer.current && map.current) {
        // Remove circle if radius is 0
        map.current.removeLayer(searchCircleLayer.current);
        searchCircleLayer.current = null;
      }
      
      // Update markers
      updateMarkers();
    }
  }, [searchCenter, searchRadius]);

  // Update markers when filteredEvents change
  useEffect(() => {
    updateMarkers();
  }, [filteredEvents]);

  return (
    <div ref={mapContainer} className="w-full h-full bg-gray-300">
      {!map.current && (
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <MapIcon size={48} className="text-gray-400 mb-2" />
          <p className="text-center text-gray-500">
            Chargement de la carte...
          </p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
