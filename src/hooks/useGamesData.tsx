
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
      
      // Traiter chaque partie pour s'assurer que les coordonnées sont valides
      const processedGames = await Promise.all(
        (games || []).map(async (game) => {
          console.log(`Processing game "${game.title}": Address="${game.address}", City="${game.city}", Stored coords=(${game.latitude}, ${game.longitude})`);
          
          // Utiliser la fonction getValidCoordinates pour obtenir des coordonnées valides
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
            // Stocker la date brute pour les calculs
            date: game.date, // Format ISO YYYY-MM-DD
            endDate: game.end_date, // Ajouter la date de fin
            location: `${game.city}`,
            department: game.zip_code ? game.zip_code.substring(0, 2) : '',
            type: game.game_type,
            country: 'France',
            lat: validCoordinates.latitude,
            lng: validCoordinates.longitude,
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
          };
        })
      );

      // Filtrer les parties avec des coordonnées valides avant de les retourner
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
