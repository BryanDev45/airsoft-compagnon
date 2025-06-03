
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getValidCoordinates } from '@/utils/geocodingUtils';
import { setStorageWithExpiry, CACHE_DURATIONS } from '@/utils/cacheUtils';
import { MapEvent } from './useMapData';

const GAMES_CACHE_KEY = 'map_games_data';

export const fetchGamesData = async (userId?: string): Promise<MapEvent[]> => {
  const cacheKey = `${GAMES_CACHE_KEY}_${userId || 'anonymous'}`;
  
  // Obtenir la date d'aujourd'hui et celle de demain pour exclure les parties d'aujourd'hui
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowISO = tomorrow.toISOString().split('T')[0];
  
  console.log('Fetching games for user:', userId || 'anonymous');
  console.log('Filtering games from date:', tomorrowISO);
  
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
    .gte('date', tomorrowISO) // Exclure les parties d'aujourd'hui et du passé
    .order('date', { ascending: true });
  
  // CORRECTION : Logique simplifiée et corrigée pour la visibilité des parties
  if (userId) {
    // Utilisateur connecté : parties publiques (is_private false ou null) + ses parties privées
    query = query.or(`is_private.is.false,is_private.is.null,and(is_private.is.true,created_by.eq.${userId})`);
    console.log('User authenticated - showing public games + user private games');
  } else {
    // Utilisateur non connecté : SEULEMENT les parties publiques (is_private false ou null)
    query = query.or('is_private.is.false,is_private.is.null');
    console.log('User not authenticated - showing only public games');
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching games data:', error);
    throw error;
  }

  console.log('Raw games data from Supabase:', data?.length || 0, 'games found');
  console.log('Games data sample:', data?.slice(0, 2));

  const formattedEvents = await Promise.all((data || []).map(async (game) => {
    const gameDate = new Date(game.date);
    const formattedDate = `${gameDate.getDate().toString().padStart(2, '0')}/${(gameDate.getMonth() + 1).toString().padStart(2, '0')}/${gameDate.getFullYear()}`;
    
    const gameImages = [
      game.Picture1,
      game.Picture2,
      game.Picture3,
      game.Picture4,
      game.Picture5
    ].filter(Boolean);
    
    const coordinates = await getValidCoordinates(
      game.latitude,
      game.longitude,
      game.address,
      game.zip_code,
      game.city
    );
    
    // Mettre à jour les coordonnées en arrière-plan si nécessaire
    if (coordinates.latitude !== game.latitude || coordinates.longitude !== game.longitude) {
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
      images: gameImages,
      image: gameImages[0] || "/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png"
    };
  }));
  
  console.log('Formatted events returned:', formattedEvents.length);
  
  // Mettre en cache pour 10 minutes
  setStorageWithExpiry(cacheKey, formattedEvents, CACHE_DURATIONS.SHORT * 2);
  
  return formattedEvents;
};

export function useGamesData(userId?: string) {
  return useQuery({
    queryKey: ['mapEvents', userId || 'anonymous'],
    queryFn: () => fetchGamesData(userId),
    refetchOnWindowFocus: false,
    staleTime: CACHE_DURATIONS.SHORT * 2, // 10 minutes
    gcTime: CACHE_DURATIONS.MEDIUM, // 30 minutes
    retry: 1
  });
}
