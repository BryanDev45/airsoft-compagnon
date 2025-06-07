
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MapEvent } from "./useMapData";

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
      
      return (games || []).map(game => ({
        id: game.id,
        title: game.title,
        // Stocker la date brute pour les calculs
        date: game.date, // Format ISO YYYY-MM-DD
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
