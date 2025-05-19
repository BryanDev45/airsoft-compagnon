
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EventCard from './EventCard';
import { MapEvent } from '@/hooks/useMapData';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface MapResultsDisplayProps {
  loading: boolean;
  filteredEvents: MapEvent[];
  loadingError?: boolean;
}

const MapResultsDisplay: React.FC<MapResultsDisplayProps> = ({ loading, filteredEvents, loadingError }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (loadingError) {
    return (
      <div className="col-span-3 text-center py-12 bg-white rounded-lg shadow-md">
        <p className="text-gray-500 text-xl">Impossible de charger les parties</p>
        {!user && (
          <>
            <p className="text-gray-400 mt-2 mb-4">Connectez-vous pour accéder à toutes les fonctionnalités</p>
            <Button onClick={handleLoginRedirect} className="bg-airsoft-red hover:bg-red-700">
              <LogIn className="mr-2 h-4 w-4" /> Se connecter
            </Button>
          </>
        )}
      </div>
    );
  }

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
