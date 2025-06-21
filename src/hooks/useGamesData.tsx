
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { geocodeAddress } from "@/utils/geocoding/geocodingService";
import { areCoordinatesValid, getDefaultCoordinatesByCountry } from "@/utils/geocodingUtils";

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
      
      // Only get future games to reduce data size
      const today = new Date().toISOString().split('T')[0];
      query = query.gte('date', today);
      
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
      
      // Process games with enhanced coordinate handling using the same geocoding as stores
      const processedGames = await Promise.all(games.map(async (game) => {
        console.log(`🎮 PROCESSING GAME - "${game.title}": Stored coords=(${game.latitude}, ${game.longitude}), Address="${game.address || ''}, ${game.zip_code || ''} ${game.city || ''}"`);
        
        let finalLat = game.latitude;
        let finalLng = game.longitude;

        // If stored coordinates are invalid, use geocoding service (same as stores)
        if (!areCoordinatesValid(game.latitude, game.longitude)) {
          console.log(`🎮 GEOCODING GAME - "${game.title}": Invalid stored coordinates, attempting geocoding...`);
          
          const geocodedCoords = await geocodeAddress(
            game.address || '',
            game.zip_code || '',
            game.city || '',
            'France',
            {
              name: game.title,
              address: game.address,
              city: game.city,
              zip_code: game.zip_code,
              type: 'game_location'
            }
          );

          if (geocodedCoords && areCoordinatesValid(geocodedCoords.latitude, geocodedCoords.longitude)) {
            finalLat = geocodedCoords.latitude;
            finalLng = geocodedCoords.longitude;
            console.log(`🎮 GEOCODING GAME - "${game.title}": Geocoding successful: (${finalLat}, ${finalLng})`);
          } else {
            // Use default France coordinates as fallback
            const defaultCoords = getDefaultCoordinatesByCountry('France');
            finalLat = defaultCoords.latitude;
            finalLng = defaultCoords.longitude;
            console.log(`🎮 GEOCODING GAME - "${game.title}": Using default France coordinates: (${finalLat}, ${finalLng})`);
          }
        } else {
          console.log(`🎮 PROCESSING GAME - "${game.title}": Using stored coordinates: (${finalLat}, ${finalLng})`);
        }
        
        console.log(`🎮 FINAL COORDS - "${game.title}": (${finalLat}, ${finalLng})`);

        return {
          id: game.id,
          title: game.title,
          date: game.date, // Format ISO YYYY-MM-DD
          endDate: game.end_date,
          location: `${game.city}`,
          department: game.zip_code ? game.zip_code.substring(0, 2) : '',
          type: game.game_type,
          country: 'France',
          lat: finalLat,
          lng: finalLng,
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
      }));

      console.log(`🎮 GAMES DATA - Returning ${processedGames.length} processed games with consistent geocoding`);
      return processedGames;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - keep reasonable cache
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
