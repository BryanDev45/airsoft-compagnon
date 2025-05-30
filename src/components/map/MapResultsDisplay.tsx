
import React from 'react';
import { Calendar, Clock, Users, Euro, AlertCircle, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapEvent, MapStore } from '@/hooks/useMapData';
import EventImageCarousel from './EventImageCarousel';

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
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-airsoft-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement des résultats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 flex-col">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-airsoft-red mx-auto mb-4" />
          <p className="text-gray-700 mb-3 font-semibold">Impossible de charger les résultats</p>
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

  const hasEvents = filteredEvents.length > 0;
  const hasStores = stores.length > 0;

  if (!hasEvents && !hasStores) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucun résultat trouvé correspondant à vos critères</p>
        <p className="text-gray-400 mt-2">Essayez d'élargir votre recherche ou de modifier vos filtres</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Parties */}
      {hasEvents && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Parties d'airsoft ({filteredEvents.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              // Collecter toutes les images disponibles
              const images = [
                event.image,
                event.Picture2,
                event.Picture3,
                event.Picture4,
                event.Picture5
              ].filter(Boolean);

              return (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <EventImageCarousel images={images} title={event.title} />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location} ({event.department})
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </div>
                    {event.maxPlayers && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        Max {event.maxPlayers} joueurs
                      </div>
                    )}
                    {event.price !== undefined && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Euro className="h-4 w-4" />
                        {event.price}€
                      </div>
                    )}
                    <Button className="w-full mt-4 bg-airsoft-red hover:bg-red-700" asChild>
                      <a href={`/game/${event.id}`}>Voir les détails</a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Magasins */}
      {hasStores && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Magasins d'airsoft ({stores.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
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
      )}
    </div>
  );
};

export default MapResultsDisplay;
