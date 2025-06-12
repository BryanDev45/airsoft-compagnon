
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MapEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  location: string;
  department: string;
  type: string;
  country: string;
  lat: number;
  lng: number;
  maxPlayers: number;
  price?: number;
  startTime: string;
  endTime: string;
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

export const useMapData = (userId?: string) => {
  return useQuery({
    queryKey: ['games', userId],
    queryFn: async (): Promise<MapEvent[]> => {
      console.log('Fetching games data for user:', userId || 'anonymous');
      
      let query = supabase
        .from('airsoft_games')
        .select('*');
      
      if (userId) {
        // Si l'utilisateur est connecté, récupérer toutes les parties publiques + ses parties privées
        query = query.or(`is_private.eq.false,and(is_private.eq.true,created_by.eq.${userId})`);
      } else {
        // Si pas connecté, récupérer seulement les parties publiques
        query = query.eq('is_private', false);
      }
      
      const { data: games, error } = await query.order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching games:', error);
        throw error;
      }
      
      console.log(`Fetched ${games?.length || 0} games`);
      
      return (games || []).map(game => ({
        id: game.id,
        title: game.title,
        // Stocker la date brute pour les calculs
        date: game.date, // Format ISO YYYY-MM-DD
        endDate: game.end_date, // Ajouter la date de fin
        location: `${game.city}`,
        department: game.zip_code ? game.zip_code.substring(0, 2) : '',
        type: game.game_type,
        country: 'France',
        lat: game.latitude || 0,
        lng: game.longitude || 0,
        maxPlayers: game.max_players,
        price: game.price,
        // Ajouter les heures de début et fin pour les calculs
        startTime: game.start_time,
        endTime: game.end_time,
        images: [
          game.Picture1,
          game.Picture2,
          game.Picture3,
          game.Picture4,
          game.Picture5
        ].filter(Boolean)
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
