
import React, { useState } from 'react';
import { useStores } from '@/hooks/useStores';
import { useStoreFiltering } from '@/hooks/useStoreFiltering';
import { useMapLocation } from '@/hooks/useMapLocation';
import MapComponent from '../map/MapComponent';
import StoreFiltersSidebar from './StoreFiltersSidebar';
import StoreResultsDisplay from './StoreResultsDisplay';
import MobileFiltersToggle from '../map/MobileFiltersToggle';
import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { useIsMobile } from "@/hooks/use-mobile";

const StoresMapSection: React.FC = () => {
  const { stores, loading: storesLoading, error: storesError } = useStores();
  const isMobile = useIsMobile();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const {
    searchQuery,
    setSearchQuery,
    selectedCountry,
    setSelectedCountry,
    searchRadius,
    setSearchRadius,
    searchCenter,
    setSearchCenter,
    filteredStores
  } = useStoreFiltering(stores);

  const { getCurrentPosition } = useMapLocation(searchQuery, setSearchCenter);
  
  const loading = storesLoading;
  const error = storesError;
  
  const handleRetry = () => {
    window.location.reload();
  };
  
  return (
    <div className="py-12 md:py-0">
      <div className="max-w-7xl mx-auto px-4 py-[30px]">
        <div className="bg-white rounded-lg overflow-hidden shadow-xl mb-8 border border-gray-200">
          {isMobile ? (
            // Layout mobile : carte en plein écran avec overlay des filtres
            <div className="relative w-full h-[600px]">
              {/* Bouton toggle pour mobile */}
              <MobileFiltersToggle
                isOpen={showMobileFilters}
                onToggle={() => setShowMobileFilters(!showMobileFilters)}
                filteredCount={filteredStores.length}
              />
              
              {/* Filtres en overlay sur mobile */}
              {showMobileFilters && (
                <div className="absolute inset-0 z-40 bg-white overflow-y-auto">
                  <StoreFiltersSidebar
                    loading={loading}
                    filteredStoresCount={filteredStores.length}
                    filterState={{
                      searchQuery,
                      selectedCountry,
                      searchRadius,
                      searchCenter
                    }}
                    setSearchQuery={setSearchQuery}
                    setSelectedCountry={setSelectedCountry}
                    setSearchRadius={setSearchRadius}
                    getCurrentPosition={getCurrentPosition}
                  />
                </div>
              )}
              
              {/* Carte */}
              <div className="w-full h-full">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="h-12 w-12 border-4 border-airsoft-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-500">Chargement de la carte...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full flex-col">
                    <div className="text-center px-4">
                      <AlertCircle className="h-12 w-12 text-airsoft-red mx-auto mb-4" />
                      <p className="text-gray-700 mb-3 font-semibold">Impossible de charger les magasins</p>
                      <p className="text-gray-500 mb-6">Veuillez vérifier votre connexion internet et réessayer</p>
                      <Button 
                        className="bg-airsoft-red hover:bg-red-700"
                        onClick={handleRetry}
                      >
                        Réessayer
                      </Button>
                    </div>
                  </div>
                ) : filteredStores.length > 0 ? (
                  <MapComponent 
                    searchCenter={searchCenter} 
                    searchRadius={searchRadius[0]} 
                    filteredEvents={[]}
                    stores={filteredStores}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center px-4">
                      <p className="text-gray-500">Aucun magasin trouvé correspondant à vos critères</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Layout desktop : côte à côte
            <div className="flex h-[600px]">
              {/* Filtres desktop */}
              <div className="w-1/4">
                <StoreFiltersSidebar
                  loading={loading}
                  filteredStoresCount={filteredStores.length}
                  filterState={{
                    searchQuery,
                    selectedCountry,
                    searchRadius,
                    searchCenter
                  }}
                  setSearchQuery={setSearchQuery}
                  setSelectedCountry={setSelectedCountry}
                  setSearchRadius={setSearchRadius}
                  getCurrentPosition={getCurrentPosition}
                />
              </div>
              
              {/* Carte desktop */}
              <div className="w-3/4 relative">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="h-12 w-12 border-4 border-airsoft-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-500">Chargement de la carte...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full flex-col">
                    <div className="text-center px-4">
                      <AlertCircle className="h-12 w-12 text-airsoft-red mx-auto mb-4" />
                      <p className="text-gray-700 mb-3 font-semibold">Impossible de charger les magasins</p>
                      <p className="text-gray-500 mb-6">Veuillez vérifier votre connexion internet et réessayer</p>
                      <Button 
                        className="bg-airsoft-red hover:bg-red-700"
                        onClick={handleRetry}
                      >
                        Réessayer
                      </Button>
                    </div>
                  </div>
                ) : filteredStores.length > 0 ? (
                  <MapComponent 
                    searchCenter={searchCenter} 
                    searchRadius={searchRadius[0]} 
                    filteredEvents={[]}
                    stores={filteredStores}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center px-4">
                      <p className="text-gray-500">Aucun magasin trouvé correspondant à vos critères</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <StoreResultsDisplay 
          loading={loading} 
          error={error} 
          filteredStores={filteredStores}
          handleRetry={handleRetry} 
        />
      </div>
    </div>
  );
};

export default StoresMapSection;
