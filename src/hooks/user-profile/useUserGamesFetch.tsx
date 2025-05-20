
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatGameData } from './gameUtils';

/**
 * Hook for fetching user games
 */
export const useUserGamesFetch = (userId: string | undefined) => {
  const [userGames, setUserGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch game participants and created games in parallel
        const [participantsResult, createdGamesResult] = await Promise.all([
          fetchGameParticipants(userId),
          fetchCreatedGames(userId)
        ]);
        
        // Process game data
        const formattedGames = await processGameData(
          userId, 
          participantsResult.gameParticipants, 
          createdGamesResult.createdGames
        );
        
        setUserGames(formattedGames);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching games:", error);
        setLoading(false);
      }
    };

    fetchGames();
  }, [userId]);

  return {
    userGames,
    loading
  };
};

/**
 * Fetch games where the user is a participant
 */
async function fetchGameParticipants(userId: string) {
  const { data: gameParticipants, error: gamesError } = await supabase
    .from('game_participants')
    .select(`
      id,
      status,
      role,
      game_id,
      user_id
    `)
    .eq('user_id', userId);

  if (gamesError) throw gamesError;
  
  return { gameParticipants: gameParticipants || [] };
}

/**
 * Fetch games created by the user
 */
async function fetchCreatedGames(userId: string) {
  const { data: createdGames, error: createdGamesError } = await supabase
    .from('airsoft_games')
    .select('*')
    .eq('created_by', userId);

  if (createdGamesError) throw createdGamesError;
  
  return { createdGames: createdGames || [] };
}

/**
 * Fetch game data for the games where user is a participant
 */
async function fetchGameDataForParticipation(gameIds: string[]) {
  if (gameIds.length === 0) return { games: [] };
  
  const { data: games, error: gamesDataError } = await supabase
    .from('airsoft_games')
    .select('*')
    .in('id', gameIds);
    
  if (gamesDataError) throw gamesDataError;
  
  return { games: games || [] };
}

/**
 * Process and format game data
 */
async function processGameData(userId: string, gameParticipants: any[], createdGames: any[]) {
  let formattedGames: any[] = [];
  
  // Process participated games
  if (gameParticipants.length > 0) {
    const gameIds = gameParticipants.map(gp => gp.game_id);
    
    if (gameIds.length > 0) {
      const { games } = await fetchGameDataForParticipation(gameIds);
      
      if (games.length > 0) {
        const participatedGames = formatParticipatedGames(gameParticipants, games);
        formattedGames = [...formattedGames, ...participatedGames];
      }
    }
  }

  // Process created games
  if (createdGames.length > 0) {
    const organizedGames = formatCreatedGames(createdGames);
    formattedGames = [...formattedGames, ...organizedGames];
  }

  // Remove duplicates
  formattedGames = removeDuplicateGames(formattedGames);
  
  return formattedGames;
}

/**
 * Format participated games data
 */
function formatParticipatedGames(gameParticipants: any[], games: any[]) {
  return gameParticipants
    .map(gp => {
      const gameData = games.find(g => g.id === gp.game_id);
      if (gameData) {
        return {
          id: gameData.id,
          title: gameData.title,
          date: new Date(gameData.date).toLocaleDateString('fr-FR'),
          location: gameData.city,
          image: '/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png',
          role: gp.role,
          status: new Date(gameData.date) > new Date() ? 'À venir' : 'Terminé',
          team: 'Indéfini',
          result: gp.status,
          address: gameData.address,
          zip_code: gameData.zip_code,
          city: gameData.city,
          price: gameData.price,
          participantsCount: 0, // Will be filled later if needed
          max_players: gameData.max_players,
          time: `${gameData.start_time} - ${gameData.end_time}`
        };
      }
      return null;
    })
    .filter(Boolean);
}

/**
 * Format created games data
 */
function formatCreatedGames(createdGames: any[]) {
  return createdGames.map(game => ({
    id: game.id,
    title: game.title,
    date: new Date(game.date).toLocaleDateString('fr-FR'),
    location: game.city,
    image: '/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png',
    role: 'Organisateur',
    status: new Date(game.date) > new Date() ? 'À venir' : 'Terminé',
    team: 'Organisateur',
    result: 'Organisateur',
    address: game.address,
    zip_code: game.zip_code,
    city: game.city,
    price: game.price,
    participantsCount: 0, // Will be filled later if needed
    max_players: game.max_players,
    time: `${game.start_time} - ${game.end_time}`
  }));
}

/**
 * Remove duplicate games from the array
 */
function removeDuplicateGames(games: any[]) {
  return games.filter((game, index, self) => 
    index === self.findIndex(g => g.id === game.id)
  );
}
