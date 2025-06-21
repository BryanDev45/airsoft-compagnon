
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
      
      // Process each game to ensure coordinates are valid
      const processedGames = await Promise.all(
        games.map(async (game) => {
          console.log(`Processing game "${game.title}": Address="${game.address}", City="${game.city}", Stored coords=(${game.latitude}, ${game.longitude})`);
          
          // Use getValidCoordinates function to get valid coordinates
          const validCoordinates = await getValidCoordinates(
            game.latitude,
            game.longitude,
            game.address || '',
            game.zip_code || '',
            game.city || '',
            'France',
            game
          );

          console.log(`Game "${game.title}": Final coordinates (${validCoordinates.latitude}, ${validCoordinates.longitude})`);

          return {
            id: game.id,
            title: game.title,
            // Store raw date for calculations
            date: game.date, // Format ISO YYYY-MM-DD
            endDate: game.end_date,
            location: `${game.city}`,
            department: game.zip_code ? game.zip_code.substring(0, 2) : '',
            type: game.game_type,
            country: 'France',
            lat: validCoordinates.latitude,
            lng: validCoordinates.longitude,
            maxPlayers: game.max_players,
            price: game.price,
            // Add start and end times for calculations
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
        })
      );

      // Filter games with valid coordinates before returning
      const validGames = processedGames.filter(game => {
        const isValid = game.lat !== 0 && game.lng !== 0 && 
                       !isNaN(game.lat) && !isNaN(game.lng) &&
                       Math.abs(game.lat) > 0.1 && Math.abs(game.lng) > 0.1;
        
        if (!isValid) {
          console.warn(`Filtering out game "${game.title}" with invalid coordinates: (${game.lat}, ${game.lng})`);
        }
        
        return isValid;
      });

      console.log(`Returning ${validGames.length} games with valid coordinates out of ${processedGames.length} total games`);
      return validGames;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
