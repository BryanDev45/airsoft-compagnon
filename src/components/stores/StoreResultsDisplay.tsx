
import React from 'react';
import { AlertCircle, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapStore } from '@/hooks/useMapData';

interface StoreResultsDisplayProps {
  loading: boolean;
  error: any;
  filteredStores: MapStore[];
  handleRetry: () => void;
}

const StoreResultsDisplay: React.FC<StoreResultsDisplayProps> = ({
  loading,
  error,
  filteredStores,
  handleRetry
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-airsoft-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement des magasins...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 flex-col">
        <div className="text-center">
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
    );
  }

  if (filteredStores.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucun magasin trouvé correspondant à vos critères</p>
        <p className="text-gray-400 mt-2">Essayez d'élargir votre recherche ou de modifier vos filtres</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Magasins d'airsoft ({filteredStores.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <Card key={store.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={store.image || "/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png"}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-emerald-500 text-white">
                    Magasin
                  </Badge>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreResultsDisplay;
