
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useGamesData } from './useGamesData';
import { useStoresData } from './useStoresData';

export interface MapEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  department: string;
  type: string;
  country: string;
  lat: number;
  lng: number;
  maxPlayers?: number;
  price?: number;
  image?: string;
  images?: string[];
}

export interface MapStore {
  id: string;
  name: string;
  address: string;
  city: string;
  zip_code: string;
  phone?: string;
  email?: string;
  website?: string;
  lat: number;
  lng: number;
  store_type: string;
  image?: string;
  picture2?: string;
  picture3?: string;
  picture4?: string;
  picture5?: string;
}

export function useMapData() {
  const { toast } = useToast();
  const { user } = useAuth();
  const location = useLocation();

  const { 
    data: events = [], 
    isLoading: eventsLoading, 
    error: eventsError, 
    refetch: refetchEvents 
  } = useGamesData(user?.id);

  const { 
    data: stores = [], 
    isLoading: storesLoading, 
    error: storesError, 
    refetch: refetchStores 
  } = useStoresData();

  // Handle errors
  useEffect(() => {
    if (eventsError && eventsError.message !== "Failed to fetch") {
      toast({
        title: "Erreur",
        description: "Impossible de charger les parties",
        variant: "destructive" 
      });
    }
    
    if (storesError && storesError.message !== "Failed to fetch") {
      toast({
        title: "Erreur",
        description: "Impossible de charger les magasins",
        variant: "destructive" 
      });
    }
  }, [eventsError, storesError, toast]);

  // Refetch data when navigating to /parties page
  useEffect(() => {
    if (location.pathname === '/parties') {
      refetchEvents();
      refetchStores();
    }
  }, [location.pathname, refetchEvents, refetchStores]);

  const loading = eventsLoading || storesLoading;
  const error = eventsError || storesError;

  return { 
    loading, 
    events, 
    stores,
    error, 
    refetch: () => {
      refetchEvents();
      refetchStores();
    }
  };
}
