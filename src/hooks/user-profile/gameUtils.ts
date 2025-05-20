
/**
 * Utility functions for game data formatting
 */

/**
 * Format a single game's data for display
 */
export const formatGameData = (gameData: any, role: string, status: string) => {
  const isUpcoming = new Date(gameData.date) > new Date();
  
  return {
    id: gameData.id,
    title: gameData.title,
    date: new Date(gameData.date).toLocaleDateString('fr-FR'),
    location: gameData.city,
    image: '/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png',
    role: role,
    status: isUpcoming ? 'À venir' : 'Terminé',
    team: role === 'Organisateur' ? 'Organisateur' : 'Indéfini',
    result: role === 'Organisateur' ? 'Organisateur' : status,
    address: gameData.address,
    zip_code: gameData.zip_code,
    city: gameData.city,
    price: gameData.price,
    participantsCount: 0, // Will be filled later if needed
    max_players: gameData.max_players,
    time: gameData.start_time && gameData.end_time ? 
      `${gameData.start_time} - ${gameData.end_time}` : null
  };
};

/**
 * Get game participant counts for a list of games
 */
export const getGameParticipantCounts = async (supabase: any, gameIds: string[]) => {
  if (!gameIds.length) return {};
  
  const counts = await Promise.all(
    gameIds.map(async (gameId) => {
      const { count, error } = await supabase
        .from('game_participants')
        .select('id', { count: 'exact', head: true })
        .eq('game_id', gameId);
        
      return { 
        gameId, 
        count: error ? 0 : count || 0 
      };
    })
  );
  
  return counts.reduce((map: Record<string, number>, item) => {
    map[item.gameId] = item.count;
    return map;
  }, {});
};
