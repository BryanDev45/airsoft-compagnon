
import React from 'react';
import { useGamesData } from '@/hooks/useGamesData';
import { useMapFiltering } from '@/hooks/useMapFiltering';
import { useMapLocation } from '@/hooks/useMapLocation';
import MapComponent from './map/MapComponent';
import MapSectionHeader from './map/MapSectionHeader';
import SearchFiltersSidebar from './map/SearchFiltersSidebar';
import MapResultsDisplay from './map/MapResultsDisplay';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useIsMobile } from "@/hooks/use-mobile";

const MapSection: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { data: events = [], isLoading: eventsLoading, error: eventsError } = useGamesData(user?.id);
  
  console.log('MapSection - User:', user ? 'authenticated' : 'anonymous');
  console.log('MapSection - Events loaded:', events.length);
  console.log('MapSection - Loading:', eventsLoading);
  console.log('MapSection - Error:', eventsError);
  
  const {
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedDepartment,
    setSelectedDepartment,
    selectedDate,
    setSelectedDate,
    selectedCountry,
    setSelectedCountry,
    searchRadius,
    setSearchRadius,
    searchCenter,
    setSearchCenter,
    filteredEvents
  } = useMapFiltering(events);

  const { getCurrentPosition } = useMapLocation(searchQuery, setSearchCenter);
  
  const loading = eventsLoading;
  const error = eventsError;
  
  console.log('MapSection - Filtered events:', filteredEvents.length);
  
  const handleRetry = () => {
    window.location.reload();
  };
  
  return (
    <div className="py-12 md:py-0">
      <div className="max-w-7xl mx-auto px-4 py-[30px]">
        <MapSectionHeader />
        
        <div className="bg-white rounded-lg overflow-hidden shadow-xl mb-8 border border-gray-200">
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-col md:flex-row'} min-h-[600px]`}>
            <SearchFiltersSidebar
              loading={loading}
              filteredEventsCount={filteredEvents.length}
              stores={[]}
              filterState={{
                searchQuery,
                selectedType,
                selectedDepartment,
                selectedDate,
                selectedCountry,
                searchRadius,
                searchCenter
              }}
              setSearchQuery={setSearchQuery}
              setSelectedType={setSelectedType}
              setSelectedDepartment={setSelectedDepartment}
              setSelectedCountry={setSelectedCountry}
              setSelectedDate={setSelectedDate}
              setSearchRadius={setSearchRadius}
              getCurrentPosition={getCurrentPosition}
            />
            
            <div className={`${isMobile ? 'w-full h-[400px]' : 'w-full md:w-3/4'} flex-1 relative`}>
              {loading ? (
                <div className="flex items-center justify-center h-full min-h-[400px]">
                  <div className="text-center">
                    <div className="h-12 w-12 border-4 border-airsoft-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Chargement de la carte...</p>
                  </div>
                </div>
              ) : error && !events.length ? (
                <div className="flex items-center justify-center h-full min-h-[400px] flex-col">
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-airsoft-red mx-auto mb-4" />
                    <p className="text-gray-700 mb-3 font-semibold">Impossible de charger les parties</p>
                    <p className="text-gray-500 mb-6">Veuillez vérifier votre connexion internet et réessayer</p>
                    <Button 
                      className="bg-airsoft-red hover:bg-red-700"
                      onClick={handleRetry}
                    >
                      Réessayer
                    </Button>
                  </div>
                </div>
              ) : filteredEvents.length > 0 ? (
                <div className={`h-full ${isMobile ? 'min-h-[400px]' : 'min-h-[600px]'}`}>
                  <MapComponent 
                    searchCenter={searchCenter} 
                    searchRadius={searchRadius[0]} 
                    filteredEvents={filteredEvents}
                    stores={[]}
                  />
                </div>
              ) : (
                <div className={`flex items-center justify-center h-full ${isMobile ? 'min-h-[400px]' : 'min-h-[600px]'}`}>
                  <div className="text-center px-4">
                    <p className="text-gray-500 text-lg mb-2">
                      {events.length === 0 
                        ? "Aucune partie disponible actuellement" 
                        : "Aucune partie trouvée correspondant à vos critères"}
                    </p>
                    {events.length === 0 && (
                      <p className="text-gray-400 text-sm">
                        {user ? "Aucune partie n'est programmée pour le moment" : "Les parties publiques apparaîtront ici"}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <MapResultsDisplay 
          loading={loading} 
          error={error && !events.length ? error : null} 
          filteredEvents={filteredEvents} 
          stores={[]}
          handleRetry={handleRetry} 
        />
      </div>
    </div>
  );
};

export default MapSection;
