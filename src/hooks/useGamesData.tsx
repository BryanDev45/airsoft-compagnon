
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { processGame, RawGameData } from "./game/gameProcessor";
import { isValidGame } from "./game/gameValidator";

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
      console.log('🎮 GAMES DATA - Fetching games data for user:', userId || 'anonymous');
      
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
      
      // Only get future games (excluding today) to reduce data size
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split('T')[0];
      
      console.log('🎮 GAMES DATA - Filtering games from:', tomorrowString);
      query = query.gte('date', tomorrowString);
      
      const { data: games, error } = await query.order('date', { ascending: true });
      
      if (error) {
        console.error('🎮 GAMES DATA - Error fetching games:', error);
        throw error;
      }
      
      console.log(`🎮 GAMES DATA - Fetched ${games?.length || 0} games from database`);
      
      if (!games || games.length === 0) {
        console.log('🎮 GAMES DATA - No games found in database');
        return [];
      }
      
      // Process games with the same geocoding system as stores
      const processedGames = await Promise.all(games.map(async (game: RawGameData) => {
        console.log(`🎮 PROCESSING - Starting processing for game: "${game.title}"`);
        const processed = await processGame(game);
        console.log(`🎮 PROCESSING - Finished processing game: "${game.title}", coords: (${processed.lat}, ${processed.lng})`);
        return processed;
      }));

      // Filter games with valid coordinates using the same validation as stores
      const validGames = processedGames.filter((game) => {
        const isValid = isValidGame(game);
        if (!isValid) {
          console.warn(`🎮 GAMES DATA - Filtering out game "${game.title}" with invalid coordinates: (${game.lat}, ${game.lng})`);
        }
        return isValid;
      });

      console.log(`🎮 GAMES DATA - Returning ${validGames.length} valid games with consistent geocoding out of ${processedGames.length} total games`);
      return validGames;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - keep reasonable cache
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
