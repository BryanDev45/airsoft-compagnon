
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { getValidCoordinates } from '@/utils/geocodingUtils';
import { getStorageWithExpiry, setStorageWithExpiry, CACHE_DURATIONS } from '@/utils/cacheUtils';

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
  image?: string;
}

const GAMES_CACHE_KEY = 'map_games_data';
const STORES_CACHE_KEY = 'map_stores_data';

const fetchGamesData = async (userId?: string): Promise<MapEvent[]> => {
  const cacheKey = `${GAMES_CACHE_KEY}_${userId || 'anonymous'}`;
  
  // Vérifier le cache d'abord
  const cachedGames = getStorageWithExpiry(cacheKey);
  if (cachedGames) {
    console.log('Using cached games data');
    return cachedGames;
  }

  const today = new Date().toISOString().split('T')[0];
  
  let query = supabase
    .from('airsoft_games')
    .select(`
      id, 
      title, 
      date, 
      address, 
      city, 
      zip_code, 
      game_type,
      max_players,
      price,
      latitude,
      longitude,
      created_at,
      created_by,
      is_private,
      Picture1,
      Picture2,
      Picture3,
      Picture4,
      Picture5
    `)
    .gte('date', today)
    .order('date', { ascending: true });
  
  if (!userId) {
    query = query.eq('is_private', false);
  } else {
    query = query.or(`is_private.eq.false,created_by.eq.${userId}`);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;

  const formattedEvents = await Promise.all(data?.map(async (game) => {
    const gameDate = new Date(game.date);
    const formattedDate = `${gameDate.getDate().toString().padStart(2, '0')}/${(gameDate.getMonth() + 1).toString().padStart(2, '0')}/${gameDate.getFullYear()}`;
    
    const gameImage = game.Picture1 || game.Picture2 || game.Picture3 || game.Picture4 || game.Picture5 || "/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png";
    
    const coordinates = await getValidCoordinates(
      game.latitude,
      game.longitude,
      game.address,
      game.zip_code,
      game.city
    );
    
    // Mettre à jour les coordonnées en arrière-plan si nécessaire
    if (coordinates.latitude !== game.latitude || coordinates.longitude !== game.longitude) {
      // Ne pas attendre cette mise à jour pour ne pas ralentir l'affichage
      (async () => {
        try {
          await supabase
            .from('airsoft_games')
            .update({
              latitude: coordinates.latitude,
              longitude: coordinates.longitude
            })
            .eq('id', game.id);
          console.log(`Updated coordinates for game ${game.id}`);
        } catch (error) {
          console.error('Failed to update coordinates:', error);
        }
      })();
    }
    
    return {
      id: game.id,
      title: game.title,
      date: formattedDate,
      location: game.city,
      department: game.zip_code?.substring(0, 2) || "",
      type: game.game_type || "woodland",
      country: "france",
      lat: coordinates.latitude,
      lng: coordinates.longitude,
      maxPlayers: game.max_players,
      price: game.price,
      image: gameImage
    };
  }) || []);
  
  // Mettre en cache pour 10 minutes
  setStorageWithExpiry(cacheKey, formattedEvents, CACHE_DURATIONS.SHORT * 2);
  
  return formattedEvents;
};

const fetchStoresData = async (): Promise<MapStore[]> => {
  // Vérifier le cache d'abord
  const cachedStores = getStorageWithExpiry(STORES_CACHE_KEY);
  if (cachedStores) {
    console.log('Using cached stores data');
    return cachedStores;
  }

  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .order('name');

  if (error) throw error;

  const formattedStores = await Promise.all(data?.map(async (store) => {
    const storeImage = store.picture1 || store.picture2 || store.picture3 || store.picture4 || store.picture5 || "/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png";
    
    const coordinates = await getValidCoordinates(
      store.latitude,
      store.longitude,
      store.address,
      store.zip_code,
      store.city
    );
    
    // Mettre à jour les coordonnées en arrière-plan si nécessaire
    if (coordinates.latitude !== store.latitude || coordinates.longitude !== store.longitude) {
      (async () => {
        try {
          await supabase
            .from('stores')
            .update({
              latitude: coordinates.latitude,
              longitude: coordinates.longitude
            })
            .eq('id', store.id);
          console.log(`Updated coordinates for store ${store.id}`);
        } catch (error) {
          console.error('Failed to update store coordinates:', error);
        }
      })();
    }
    
    return {
      id: store.id,
      name: store.name,
      address: store.address,
      city: store.city,
      zip_code: store.zip_code,
      phone: store.phone,
      email: store.email,
      website: store.website,
      lat: coordinates.latitude,
      lng: coordinates.longitude,
      image: storeImage
    };
  }) || []);
  
  // Mettre en cache pour 30 minutes
  setStorageWithExpiry(STORES_CACHE_KEY, formattedStores, CACHE_DURATIONS.MEDIUM);
  
  return formattedStores;
};

export function useMapData() {
  const { toast } = useToast();
  const { user } = useAuth();

  // Utiliser React Query pour les événements
  const { 
    data: events = [], 
    isLoading: eventsLoading, 
    error: eventsError, 
    refetch: refetchEvents 
  } = useQuery({
    queryKey: ['mapEvents', user?.id],
    queryFn: () => fetchGamesData(user?.id),
    refetchOnWindowFocus: false,
    staleTime: CACHE_DURATIONS.SHORT * 2, // 10 minutes
    gcTime: CACHE_DURATIONS.MEDIUM, // 30 minutes
    retry: 1,
    meta: {
      errorHandler: (error: any) => {
        if (error.message !== "Failed to fetch") {
          toast({
            title: "Erreur",
            description: "Impossible de charger les parties",
            variant: "destructive" 
          });
        }
      }
    }
  });

  // Utiliser React Query pour les magasins
  const { 
    data: stores = [], 
    isLoading: storesLoading, 
    error: storesError, 
    refetch: refetchStores 
  } = useQuery({
    queryKey: ['mapStores'],
    queryFn: fetchStoresData,
    refetchOnWindowFocus: false,
    staleTime: CACHE_DURATIONS.MEDIUM, // 30 minutes
    gcTime: CACHE_DURATIONS.LONG, // 24 heures
    retry: 1,
    meta: {
      errorHandler: (error: any) => {
        if (error.message !== "Failed to fetch") {
          toast({
            title: "Erreur",
            description: "Impossible de charger les magasins",
            variant: "destructive" 
          });
        }
      }
    }
  });

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
