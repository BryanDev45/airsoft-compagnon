
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
import { MapStore } from '@/hooks/useMapData';

interface StoresMapProps {
  stores: MapStore[];
  onStoreSelect: (store: MapStore | null) => void;
  selectedStore: MapStore | null;
  isAdmin: boolean;
  onEditStore: (store: MapStore) => void;
}

const StoresMap: React.FC<StoresMapProps> = ({ 
  stores, 
  onStoreSelect, 
  selectedStore,
  isAdmin,
  onEditStore 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstance = useRef<Map | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Créer la carte une seule fois au chargement initial
  useEffect(() => {
    if (!mapRef.current || initialized) return;

    // Initialiser la source de tuiles OSM d'abord
    const osmSource = new OSM();
    const tileLayer = new TileLayer({
      source: osmSource,
      zIndex: 0
    });

    // Créer la source vectorielle pour les marqueurs
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      zIndex: 1
    });

    // Créer la carte avec les couches spécifiées
    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [
        tileLayer,
        vectorLayer
      ],
      view: new View({
        center: fromLonLat([2.3522, 46.2276]), // Centre de la France
        zoom: 6,
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

  // Mettre à jour les marqueurs quand les magasins changent
  useEffect(() => {
    if (!mapInstance.current || !initialized || !stores.length) return;

    const vectorLayers = mapInstance.current.getLayers().getArray().filter(
      layer => layer instanceof VectorLayer
    ) as VectorLayer<VectorSource>[];
    
    if (vectorLayers.length > 0) {
      const vectorSource = vectorLayers[0].getSource();
      if (vectorSource) {
        // Effacer les anciens marqueurs
        vectorSource.clear();
        
        // Ajouter les nouveaux marqueurs
        stores.forEach(store => {
          if (store.lat && store.lng) {
            const marker = new Feature({
              geometry: new Point(fromLonLat([store.lng, store.lat])),
              store: store
            });

            marker.setStyle(
              new Style({
                image: new CircleStyle({
                  radius: 8,
                  fill: new Fill({
                    color: selectedStore?.id === store.id ? '#ea384c' : '#22c55e'
                  }),
                  stroke: new Stroke({
                    color: '#ffffff',
                    width: 2
                  })
                })
              })
            );

            vectorSource.addFeature(marker);
          }
        });
        
        // Ajuster la vue pour inclure tous les marqueurs
        if (stores.length > 0) {
          const extent = vectorSource.getExtent();
          mapInstance.current.getView().fit(extent, { padding: [50, 50, 50, 50] });
        }
      }
    }

    // Gestionnaire de clic sur la carte
    const handleMapClick = (event: any) => {
      const feature = mapInstance.current?.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      if (feature) {
        const store = feature.get('store');
        if (store) {
          onStoreSelect(store);
        }
      } else {
        onStoreSelect(null);
      }
    };

    mapInstance.current.on('click', handleMapClick);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.un('click', handleMapClick);
      }
    };
  }, [stores, selectedStore, initialized, onStoreSelect]);

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
      
      {/* Information du magasin sélectionné */}
      {mapLoaded && selectedStore && (
        <div className="absolute bottom-3 left-3 bg-white bg-opacity-95 py-3 px-4 rounded shadow-lg z-20 max-w-[80%]">
          <h3 className="font-semibold text-sm">{selectedStore.name}</h3>
          <p className="text-xs text-gray-600 flex items-center mt-1">
            <MapPin size={12} className="text-airsoft-red mr-1 flex-shrink-0" />
            <span className="truncate">{selectedStore.address}, {selectedStore.city}</span>
          </p>
          {isAdmin && (
            <button 
              onClick={() => onEditStore(selectedStore)}
              className="mt-2 text-xs bg-airsoft-red text-white px-2 py-1 rounded hover:bg-red-700"
            >
              Modifier
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StoresMap;
