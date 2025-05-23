
import React from 'react';
import { useMapData } from '@/hooks/useMapData';
import { useMapFiltering } from '@/hooks/useMapFiltering';
import { useMapLocation } from '@/hooks/useMapLocation';
import MapComponent from './map/MapComponent';
import MapSectionHeader from './map/MapSectionHeader';
import SearchFiltersSidebar from './map/SearchFiltersSidebar';
import MapResultsDisplay from './map/MapResultsDisplay';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

const MapSection: React.FC = () => {
  // Ajout de l'état d'authentification pour améliorer l'expérience utilisateur
  const { user } = useAuth();
  const { loading, events, error } = useMapData();
  
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
  
  // Fonction pour recharger les données
  const handleRetry = () => {
    window.location.reload();
  };
  
  return (
    <div className="py-12 md:py-0">
      <div className="max-w-7xl mx-auto px-4 py-[30px]">
        <MapSectionHeader />
        
        <div className="bg-white rounded-lg overflow-hidden shadow-xl mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row h-full">
            <SearchFiltersSidebar
              loading={loading}
              filteredEventsCount={filteredEvents.length}
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
            
            <div className="w-full md:w-3/4 h-[600px] relative">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="h-12 w-12 border-4 border-airsoft-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Chargement de la carte...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full flex-col">
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
                <MapComponent searchCenter={searchCenter} searchRadius={searchRadius[0]} filteredEvents={filteredEvents} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-gray-500">Aucune partie trouvée correspondant à vos critères</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <MapResultsDisplay loading={loading} error={error} filteredEvents={filteredEvents} handleRetry={handleRetry} />
      </div>
    </div>
  );
};

export default MapSection;
