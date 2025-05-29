
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { getValidCoordinates } from '@/utils/geocodingUtils';

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

export function useMapData() {
  const { toast } = useToast();
  const { user } = useAuth();

  // Use React Query for games data fetching
  const { 
    data: events = [], 
    isLoading: eventsLoading, 
    error: eventsError, 
    refetch: refetchEvents 
  } = useQuery({
    queryKey: ['mapEvents', user?.id],
    queryFn: fetchGames,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
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

  // Use React Query for stores data fetching
  const { 
    data: stores = [], 
    isLoading: storesLoading, 
    error: storesError, 
    refetch: refetchStores 
  } = useQuery({
    queryKey: ['mapStores'],
    queryFn: fetchStores,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
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

  // Function to fetch games
  async function fetchGames(): Promise<MapEvent[]> {    
    const today = new Date().toISOString().split('T')[0];
    
    try {
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
      
      if (!user) {
        query = query.eq('is_private', false);
      } else {
        query = query.or(`is_private.eq.false,created_by.eq.${user.id}`);
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
        
        // Update database with corrected coordinates if needed
        if (coordinates.latitude !== game.latitude || coordinates.longitude !== game.longitude) {
          try {
            await supabase
              .from('airsoft_games')
              .update({
                latitude: coordinates.latitude,
                longitude: coordinates.longitude
              })
              .eq('id', game.id);
          } catch (updateError) {
            console.error('Failed to update coordinates in database:', updateError);
          }
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
      
      return formattedEvents;
    } catch (error) {
      console.error("Error loading map games data:", error);
      return [];
    }
  }

  // Function to fetch stores
  async function fetchStores(): Promise<MapStore[]> {
    try {
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
        
        // Update database with corrected coordinates if needed
        if (coordinates.latitude !== store.latitude || coordinates.longitude !== store.longitude) {
          try {
            await supabase
              .from('stores')
              .update({
                latitude: coordinates.latitude,
                longitude: coordinates.longitude
              })
              .eq('id', store.id);
          } catch (updateError) {
            console.error('Failed to update store coordinates in database:', updateError);
          }
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
      
      return formattedStores;
    } catch (error) {
      console.error("Error loading stores data:", error);
      return [];
    }
  }

  const loading = eventsLoading || storesLoading;
  const error = eventsError || storesError;

  useEffect(() => {
    if (error) {
      console.error("Error loading map data:", error);
    }
  }, [error]);

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
