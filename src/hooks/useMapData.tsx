
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

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

export function useMapData() {
  const { toast } = useToast();
  const { user } = useAuth();

  // Utilisez React Query pour la mise en cache et la gestion des états
  const { 
    data: events = [], 
    isLoading: loading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['mapEvents', user?.id],
    queryFn: fetchGames,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Cache valide pendant 5 minutes
    retry: 1,
    onError: (error: any) => {
      // Ne pas afficher de toast pour les erreurs de réseau pour éviter le spam
      if (error.message !== "Failed to fetch") {
        toast({
          title: "Erreur",
          description: "Impossible de charger les parties",
          variant: "destructive" 
        });
      }
    }
  });

  // Fonction pour récupérer les jeux
  async function fetchGames(): Promise<MapEvent[]> {    
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    
    // Construction de la requête de base
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
      .gte('date', today) // Filtrer pour n'afficher que les parties à venir ou du jour même
      .order('date', { ascending: true });
    
    // Ne montrons que les parties publiques aux utilisateurs non connectés
    // Pour les utilisateurs connectés, afficher aussi leurs parties privées
    if (!user) {
      query = query.eq('is_private', false);
    } else {
      query = query.or(`is_private.eq.false,created_by.eq.${user.id}`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }

    // Transformation des données pour correspondre au format attendu par les composants existants
    const formattedEvents = data?.map(game => {
      // Format date as DD/MM/YYYY for display
      const gameDate = new Date(game.date);
      const formattedDate = `${gameDate.getDate().toString().padStart(2, '0')}/${(gameDate.getMonth() + 1).toString().padStart(2, '0')}/${gameDate.getFullYear()}`;
      
      // Get the first available image, or use default
      const gameImage = game.Picture1 || game.Picture2 || game.Picture3 || game.Picture4 || game.Picture5 || "/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png";
      
      return {
        id: game.id,
        title: game.title,
        date: formattedDate,
        location: game.city,
        department: game.zip_code?.substring(0, 2) || "",
        type: game.game_type || "woodland",
        country: "france", // Valeur par défaut, peut être étendue plus tard
        lat: game.latitude ? parseFloat(String(game.latitude)) : 48.8566,
        lng: game.longitude ? parseFloat(String(game.longitude)) : 2.3522,
        maxPlayers: game.max_players,
        price: game.price,
        image: gameImage
      };
    }) || [];
    
    return formattedEvents;
  }

  return { 
    loading, 
    events, 
    error, 
    refetch 
  };
}
