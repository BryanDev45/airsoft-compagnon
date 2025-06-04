
import React from 'react';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapStore } from '@/hooks/useMapData';
import GameImageCarousel from './GameImageCarousel';

interface StoreCardProps {
  store: MapStore;
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="h-48 w-full overflow-hidden">
          <img
            src={store.image || "/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png"}
            alt={store.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-2 right-2 z-10">
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
  );
};

export default StoreCard;
