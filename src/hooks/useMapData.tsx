
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
  endTime?: string; // Ajout pour pouvoir calculer les dates multi-jours
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

  // Toujours charger les données, même sans authentification
  // Si l'utilisateur est connecté, passer son ID pour voir aussi ses parties privées
  // Sinon, passer undefined pour voir seulement les parties publiques
  const userId = user?.id;
  
  console.log('useMapData - Current user:', user ? 'authenticated' : 'anonymous');
  console.log('useMapData - User ID being passed:', userId);
  
  const { 
    data: events = [], 
    isLoading: eventsLoading, 
    error: eventsError, 
    refetch: refetchEvents 
  } = useGamesData(userId);

  const { 
    data: stores = [], 
    isLoading: storesLoading, 
    error: storesError, 
    refetch: refetchStores 
  } = useStoresData();

  // Handle errors (mais pas les erreurs de réseau temporaires)
  useEffect(() => {
    if (eventsError && eventsError.message !== "Failed to fetch" && !eventsError.message?.includes('network')) {
      console.error('Events error:', eventsError);
      toast({
        title: "Erreur",
        description: "Impossible de charger les parties",
        variant: "destructive" 
      });
    }
    
    if (storesError && storesError.message !== "Failed to fetch" && !storesError.message?.includes('network')) {
      console.error('Stores error:', storesError);
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
      console.log('Refetching data for /parties page');
      refetchEvents();
      refetchStores();
    }
  }, [location.pathname, refetchEvents, refetchStores]);

  const loading = eventsLoading || storesLoading;
  const error = eventsError || storesError;

  console.log('useMapData - Events loaded:', events.length);
  console.log('useMapData - Loading state:', loading);
  console.log('useMapData - Error state:', error);

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
