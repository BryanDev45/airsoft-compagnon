
import React from 'react';
import { MapEvent, MapStore } from '@/hooks/useMapData';
import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import GameCard from './GameCard';
import StoreCard from './StoreCard';
import { LoadingState, ErrorState, EmptyState } from './MapResultsState';

interface MapResultsDisplayProps {
  loading: boolean;
  error: any;
  filteredEvents: MapEvent[];
  stores?: MapStore[];
  handleRetry: () => void;
}

const MapResultsDisplay: React.FC<MapResultsDisplayProps> = ({
  loading,
  error,
  filteredEvents,
  stores = [],
  handleRetry
}) => {
  // Récupérer le nombre de participants pour chaque partie
  const { data: participantCounts = {} } = useQuery({
    queryKey: ['participant-counts', filteredEvents.map(e => e.id)],
    queryFn: async () => {
      if (filteredEvents.length === 0) return {};
      
      const gameIds = filteredEvents.map(event => event.id);
      const { data, error } = await supabase
        .from('game_participants')
        .select('game_id')
        .in('game_id', gameIds)
        .eq('status', 'Confirmé');
      
      if (error) throw error;
      
      // Compter les participants par partie
      const counts: Record<string, number> = {};
      gameIds.forEach(id => counts[id] = 0);
      
      data?.forEach(participant => {
        counts[participant.game_id] = (counts[participant.game_id] || 0) + 1;
      });
      
      return counts;
    },
    enabled: filteredEvents.length > 0,
  });

  if (loading) {
    return <LoadingState message="Chargement des résultats..." />;
  }

  if (error) {
    return (
      <ErrorState 
        title="Impossible de charger les résultats"
        description="Veuillez vérifier votre connexion internet et réessayer"
        onRetry={handleRetry}
      />
    );
  }

  const hasEvents = filteredEvents.length > 0;
  const hasStores = stores.length > 0;

  if (!hasEvents && !hasStores) {
    return (
      <EmptyState 
        message="Aucun résultat trouvé correspondant à vos critères"
        description="Essayez d'élargir votre recherche ou de modifier vos filtres"
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Section des parties */}
      {hasEvents && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Parties d'airsoft ({filteredEvents.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <GameCard
                key={event.id}
                event={event}
                participantCount={participantCounts[event.id] || 0}
              />
            ))}
          </div>
        </div>
      )}

      {/* Section des magasins */}
      {hasStores && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Magasins d'airsoft ({stores.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapResultsDisplay;
