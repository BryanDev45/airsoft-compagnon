
import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapStore } from '@/hooks/useMapData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import StoreImageCarousel from './StoreImageCarousel';
import StoreAdminActions from './StoreAdminActions';

interface StoreResultsDisplayProps {
  stores: MapStore[];
  isAdmin: boolean;
  onEditStore: (store: MapStore) => void;
}

const StoreResultsDisplay: React.FC<StoreResultsDisplayProps> = ({
  stores,
  isAdmin,
  onEditStore
}) => {
  const handleStoreUpdate = () => {
    // Recharger la page pour rafraîchir les données
    window.location.reload();
  };

  if (stores.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucun magasin trouvé correspondant à vos critères</p>
        <p className="text-gray-400 mt-2">Essayez d'élargir votre recherche ou de modifier vos filtres</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => {
          // Récupérer toutes les images du magasin
          const storeImages = [
            store.image,
            store.picture2,
            store.picture3,
            store.picture4,
            store.picture5,
          ].filter(Boolean);

          return (
            <Card key={store.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <StoreImageCarousel 
                  images={storeImages}
                  storeName={store.name}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Badge variant="secondary" className="bg-emerald-500 text-white">
                    Magasin
                  </Badge>
                  {isAdmin && (
                    <StoreAdminActions 
                      store={store} 
                      onStoreUpdate={handleStoreUpdate}
                    />
                  )}
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{store.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {store.address}, {store.zip_code} {store.city}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {store.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    {store.phone}
                  </div>
                )}
                {store.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    {store.email}
                  </div>
                )}
                {store.website && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe className="h-4 w-4" />
                    <a 
                      href={store.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Site web
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StoreResultsDisplay;
