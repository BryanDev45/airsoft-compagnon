
import React from 'react';
import { Calendar, MapPin, Users, Euro, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MapEvent, MapStore } from '@/hooks/useGamesData';
import GameImageCarousel from './GameImageCarousel';
import StoreImageCarousel from '../stores/StoreImageCarousel';
import { useQuery } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/client';
import { formatGameDate } from '@/utils/dateUtils';

interface MapPopupProps {
  selectedEvent: MapEvent | null;
  selectedStore: MapStore | null;
  onClose: () => void;
}

const MapPopup: React.FC<MapPopupProps> = ({ selectedEvent, selectedStore, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Récupérer le nombre de participants pour l'événement sélectionné
  const { data: participantCount = 0 } = useQuery({
    queryKey: ['participant-count', selectedEvent?.id],
    queryFn: async () => {
      if (!selectedEvent) return 0;
      
      const { data, error } = await supabase
        .from('game_participants')
        .select('id')
        .eq('game_id', selectedEvent.id)
        .eq('status', 'Confirmé');
      
      if (error) throw error;
      return data?.length || 0;
    },
    enabled: !!selectedEvent,
  });

  const handleViewMore = () => {
    if (!selectedEvent) return;
    
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/game/${selectedEvent.id}`);
  };

  if (selectedEvent) {
    const formattedDate = formatGameDate(selectedEvent.date, selectedEvent.endDate);

    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-[400px] border border-gray-200 flex flex-col">
        <div className="relative h-40 flex-shrink-0">
          <GameImageCarousel 
            images={selectedEvent.images || []} 
            title={selectedEvent.title} 
          />
        </div>
        
        <div className="p-4 space-y-3 flex-grow flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-gray-900 pr-2">{selectedEvent.title}</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-2 flex-grow">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              {selectedEvent.location} ({selectedEvent.department})
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {participantCount}/{selectedEvent.maxPlayers || 20} joueurs
              </div>
              
              <div className="flex items-center gap-1">
                <Euro className="h-4 w-4" />
                {selectedEvent.price || 0}€
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleViewMore}
            className="w-full mt-3 bg-airsoft-red hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors flex-shrink-0"
          >
            Voir plus
          </button>
        </div>
      </div>
    );
  }

  if (selectedStore) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-[400px] border border-gray-200 flex flex-col">
        <div className="relative h-40 flex-shrink-0">
          <StoreImageCarousel 
            images={[
              selectedStore.image,
              selectedStore.picture2,
              selectedStore.picture3,
              selectedStore.picture4,
              selectedStore.picture5
            ].filter(Boolean)}
            storeName={selectedStore.name}
          />
        </div>
        
        <div className="p-4 space-y-3 flex-grow flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-gray-900 pr-2">{selectedStore.name}</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-2 flex-grow">
            <p className="text-sm text-gray-600 flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
              <span className="break-words">{selectedStore.address}, {selectedStore.zip_code} {selectedStore.city}</span>
            </p>
            
            {selectedStore.phone && (
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="text-gray-400">📞</span>
                <span>{selectedStore.phone}</span>
              </p>
            )}
            
            {selectedStore.email && (
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="text-gray-400">✉️</span>
                <span className="break-all">{selectedStore.email}</span>
              </p>
            )}
            
            {selectedStore.website && (
              <a 
                href={selectedStore.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline inline-flex items-center gap-2"
              >
                <span className="text-gray-400">🌐</span>
                <span>Site web</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MapPopup;
