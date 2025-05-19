
import React from 'react';
import { useMapData } from '@/hooks/useMapData';
import { useMapFiltering } from '@/hooks/useMapFiltering';
import { useMapLocation } from '@/hooks/useMapLocation';
import MapComponent from './map/MapComponent';
import MapSectionHeader from './map/MapSectionHeader';
import SearchFiltersSidebar from './map/SearchFiltersSidebar';
import MapResultsDisplay from './map/MapResultsDisplay';
import { useAuth } from '@/hooks/useAuth';
import { LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const MapSection: React.FC = () => {
  // Ajout de l'état d'authentification pour améliorer l'expérience utilisateur
  const { user } = useAuth();
  const navigate = useNavigate();
  const { loading, events, loadingError } = useMapData();
  
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

  const handleLoginRedirect = () => {
    navigate('/login');
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
              ) : loadingError ? (
                <div className="flex items-center justify-center h-full flex-col">
                  <div className="text-center p-6">
                    <p className="text-gray-500 mb-3">Une erreur s'est produite lors du chargement des parties</p>
                    {!user && (
                      <>
                        <p className="text-gray-400 text-sm mb-4">Connectez-vous pour accéder à toutes les fonctionnalités</p>
                        <Button onClick={handleLoginRedirect} className="bg-airsoft-red hover:bg-red-700">
                          <LogIn className="mr-2 h-4 w-4" /> Se connecter
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ) : filteredEvents.length > 0 ? (
                <MapComponent searchCenter={searchCenter} searchRadius={searchRadius[0]} filteredEvents={filteredEvents} />
              ) : !user && events.length === 0 ? (
                <div className="flex items-center justify-center h-full flex-col">
                  <div className="text-center p-6">
                    <p className="text-gray-500 mb-3">Connectez-vous pour voir toutes les parties disponibles</p>
                    <p className="text-gray-400 text-sm mb-4">Les parties privées sont visibles uniquement aux utilisateurs connectés</p>
                    <Button onClick={handleLoginRedirect} className="bg-airsoft-red hover:bg-red-700">
                      <LogIn className="mr-2 h-4 w-4" /> Se connecter
                    </Button>
                  </div>
                </div>
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
        
        <MapResultsDisplay loading={loading} filteredEvents={filteredEvents} loadingError={loadingError} />
      </div>
    </div>
  );
};

export default MapSection;
