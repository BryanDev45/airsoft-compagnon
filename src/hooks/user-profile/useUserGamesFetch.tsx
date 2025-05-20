
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
        // 1. First, fetch games where the user is a participant
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

        // 2. Fetch games created by the user
        const { data: createdGames, error: createdGamesError } = await supabase
          .from('airsoft_games')
          .select('*')
          .eq('created_by', userId);

        if (createdGamesError) throw createdGamesError;
        
        console.log("Created games:", createdGames);
        console.log("Game participants:", gameParticipants);

        let formattedGames: any[] = [];

        // 3. Format participated games
        if (gameParticipants && gameParticipants.length > 0) {
          // Fetch the actual game data for each participation
          const gameIds = gameParticipants.map(gp => gp.game_id);
          
          if (gameIds.length > 0) {
            const { data: games, error: gamesDataError } = await supabase
              .from('airsoft_games')
              .select('*')
              .in('id', gameIds);
              
            if (gamesDataError) throw gamesDataError;
            
            if (games && games.length > 0) {
              const participatedGames = gameParticipants.map(gp => {
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
              }).filter(Boolean);
              
              formattedGames = [...formattedGames, ...participatedGames];
            }
          }
        }

        // 4. Format created games
        if (createdGames && createdGames.length > 0) {
          const organizedGames = createdGames.map(game => ({
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
          
          formattedGames = [...formattedGames, ...organizedGames];
        }

        // Remove duplicates in case a game appears in both participated and created lists
        formattedGames = formattedGames.filter((game, index, self) => 
          index === self.findIndex(g => g.id === game.id)
        );

        console.log("Final formatted games:", formattedGames);
        
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
