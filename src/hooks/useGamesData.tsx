export const fetchGamesData = async (): Promise<MapEvent[]> => {
  const cacheKey = 'map_games_data_public';

  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
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
    .eq('is_private', false) // 👈 Affiche uniquement les parties publiques
    .order('date', { ascending: true });

  if (error) throw error;

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

    // Mise à jour des coordonnées si nécessaires
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

  setStorageWithExpiry(cacheKey, formattedEvents, CACHE_DURATIONS.SHORT * 2);

  return formattedEvents;
};

export function useGamesData() {
  return useQuery({
    queryKey: ['mapEvents'],
    queryFn: fetchGamesData,
    refetchOnWindowFocus: false,
    staleTime: CACHE_DURATIONS.SHORT * 2,
    gcTime: CACHE_DURATIONS.MEDIUM,
    retry: 1
  });
}
