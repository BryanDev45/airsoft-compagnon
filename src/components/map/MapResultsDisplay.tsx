
import React from 'react';
import { Link } from 'react-router-dom';
import EventCard from './EventCard';
import { MapEvent } from '@/hooks/useMapData';
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react';

interface MapResultsDisplayProps {
  loading: boolean;
  error: Error | null;
  filteredEvents: MapEvent[];
  handleRetry: () => void;
}

const MapResultsDisplay: React.FC<MapResultsDisplayProps> = ({ loading, error, filteredEvents, handleRetry }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      {loading ? (
        Array.from({length: 3}).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))
      ) : error ? (
        <div className="col-span-3 text-center py-12 bg-white rounded-lg shadow-sm">
          <AlertCircle className="h-10 w-10 text-airsoft-red mx-auto mb-3" />
          <p className="text-gray-700 text-xl mb-2">Impossible de charger les parties</p>
          <p className="text-gray-500 mb-4">Veuillez vérifier votre connexion internet et réessayer</p>
          <Button 
            className="bg-airsoft-red hover:bg-red-700"
            onClick={handleRetry}
          >
            Réessayer
          </Button>
        </div>
      ) : filteredEvents.length > 0 ? (
        filteredEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))
      ) : (
        <div className="col-span-3 text-center py-12">
          <p className="text-gray-500 text-xl">Aucune partie trouvée correspondant à vos critères</p>
          <p className="text-gray-400 mt-2">Essayez de modifier vos filtres ou <Link to="/parties/create" className="text-airsoft-red hover:underline">créez votre propre partie</Link></p>
        </div>
      )}
    </div>
  );
};

export default MapResultsDisplay;
