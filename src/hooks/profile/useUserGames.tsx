
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserGames = (userId: string | undefined) => {
  const [userGames, setUserGames] = useState<any[]>([]);

  const fetchUserGames = async () => {
    if (!userId) return;
    
    try {
      // 1. Fetch games where the user is a participant
      const { data: gameParticipants, error: participantsError } = await supabase
        .from('game_participants')
        .select('*, game_id')
        .eq('user_id', userId);
        
      if (participantsError) throw participantsError;
      
      // 2. Fetch games created by the user
      const { data: createdGames, error: createdGamesError } = await supabase
        .from('airsoft_games')
        .select('*')
        .eq('created_by', userId);
        
      if (createdGamesError) throw createdGamesError;
      
      console.log("Created games:", createdGames);
      console.log("Participated games:", gameParticipants);
      
      let formattedGames: any[] = [];
      
      // 3. Format participated games
      if (gameParticipants && gameParticipants.length > 0) {
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
                  result: gp.status
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
          result: 'Organisateur'
        }));
        
        formattedGames = [...formattedGames, ...organizedGames];
      }
      
      // 5. Update the games_organized count in user_stats if needed
      if (createdGames && createdGames.length > 0) {
        const { error: updateError } = await supabase
          .from('user_stats')
          .update({ games_organized: createdGames.length })
          .eq('user_id', userId);
          
        if (updateError) {
          console.error("Error updating games_organized count:", updateError);
        } else {
          console.log("Updated games_organized count to:", createdGames.length);
        }
      }
      
      // Remove duplicates
      formattedGames = formattedGames.filter((game, index, self) => 
        index === self.findIndex(g => g.id === game.id)
      );
      
      console.log("Final formatted games:", formattedGames);
      setUserGames(formattedGames);
      
    } catch (error) {
      console.error("Erreur lors de la récupération des parties:", error);
    }
  };

  return {
    userGames,
    fetchUserGames
  };
};
