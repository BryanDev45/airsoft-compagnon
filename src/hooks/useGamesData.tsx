
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getValidCoordinates } from "@/utils/geocodingUtils";

// Export the types that are used throughout the application
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
  maxPlayers?: number;
  price?: number;
  startTime?: string;
  endTime?: string;
  images: string[];
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
  image: string;
  picture2?: string;
  picture3?: string;
  picture4?: string;
  picture5?: string;
}

export const useGamesData = (userId?: string) => {
  return useQuery({
    queryKey: ['games', userId],
    queryFn: async (): Promise<MapEvent[]> => {
      console.log('Fetching games data for user:', userId || 'anonymous');
      
      let query = supabase
        .from('airsoft_games')
        .select('*');
      
      // Always get public games, add private ones only if user is authenticated
      if (userId) {
        // If user is connected, get public games + their private games
        query = query.or(`is_private.eq.false,and(is_private.eq.true,created_by.eq.${userId})`);
      } else {
        // If not connected, get only public games
        query = query.eq('is_private', false);
      }
      
      // Only get future games to reduce data size
      const today = new Date().toISOString().split('T')[0];
      query = query.gte('date', today);
      
      const { data: games, error } = await query.order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching games:', error);
        throw error;
      }
      
      console.log(`Fetched ${games?.length || 0} games from database`);
      
      if (!games || games.length === 0) {
        console.log('No games found in database');
        return [];
      }
      
      // Process games with optimized coordinate handling
      const processedGames = games.map((game) => {
        console.log(`Processing game "${game.title}": Stored coords=(${game.latitude}, ${game.longitude})`);
        
        // Use stored coordinates if valid, otherwise use default France coordinates
        let lat = 46.603354; // Default France center
        let lng = 1.8883335;
        
        if (game.latitude && game.longitude && 
            !isNaN(game.latitude) && !isNaN(game.longitude) &&
            Math.abs(game.latitude) > 0.1 && Math.abs(game.longitude) > 0.1) {
          lat = Number(game.latitude);
          lng = Number(game.longitude);
        }

        return {
          id: game.id,
          title: game.title,
          date: game.date, // Format ISO YYYY-MM-DD
          endDate: game.end_date,
          location: `${game.city}`,
          department: game.zip_code ? game.zip_code.substring(0, 2) : '',
          type: game.game_type,
          country: 'France',
          lat,
          lng,
          maxPlayers: game.max_players,
          price: game.price,
          startTime: game.start_time,
          endTime: game.end_time,
          images: [
            game.Picture1,
            game.Picture2,
            game.Picture3,
            game.Picture4,
            game.Picture5
          ].filter(Boolean)
        };
      });

      console.log(`Returning ${processedGames.length} processed games`);
      return processedGames;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1, // Reduce retry attempts
  });
};
