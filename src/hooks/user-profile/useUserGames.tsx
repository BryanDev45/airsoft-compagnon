
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
      let pastGamesCount = 0; // Compteur pour les parties déjà jouées
      
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
            // For each game, get the participant count
            const gameParticipantCounts = await Promise.all(
              games.map(async (game) => {
                const { count, error } = await supabase
                  .from('game_participants')
                  .select('id', { count: 'exact', head: true })
                  .eq('game_id', game.id);
                  
                return { 
                  gameId: game.id, 
                  count: error ? 0 : count || 0 
                };
              })
            );
            
            const participantCountMap = gameParticipantCounts.reduce((map, item) => {
              map[item.gameId] = item.count;
              return map;
            }, {});
            
            const participatedGames = gameParticipants.map(gp => {
              const gameData = games.find(g => g.id === gp.game_id);
              if (gameData) {
                const gameDate = new Date(gameData.date);
                const isUpcoming = gameDate > new Date();
                
                // Incrémenter le compteur si la partie est déjà passée
                if (!isUpcoming) {
                  pastGamesCount++;
                }
                
                return {
                  id: gameData.id,
                  title: gameData.title,
                  date: new Date(gameData.date).toLocaleDateString('fr-FR'),
                  rawDate: gameData.date, // Ajout de la date brute pour le tri
                  location: gameData.city,
                  address: gameData.address,
                  zip_code: gameData.zip_code,
                  city: gameData.city,
                  max_players: gameData.max_players,
                  participantsCount: participantCountMap[gameData.id] || 0,
                  price: gameData.price, // Ajout du prix
                  image: '/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png',
                  role: gp.role,
                  status: isUpcoming ? 'À venir' : 'Terminé',
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
        // For each created game, get the participant count
        const createdGameParticipantCounts = await Promise.all(
          createdGames.map(async (game) => {
            const { count, error } = await supabase
              .from('game_participants')
              .select('id', { count: 'exact', head: true })
              .eq('game_id', game.id);
              
            return { 
              gameId: game.id, 
              count: error ? 0 : count || 0 
            };
          })
        );
        
        const createdGameCountMap = createdGameParticipantCounts.reduce((map, item) => {
          map[item.gameId] = item.count;
          return map;
        }, {});
        
        const organizedGames = createdGames.map(game => {
          const gameDate = new Date(game.date);
          const isUpcoming = gameDate > new Date();
          
          return {
            id: game.id,
            title: game.title,
            date: new Date(game.date).toLocaleDateString('fr-FR'),
            rawDate: game.date, // Ajout de la date brute pour le tri
            location: game.city,
            address: game.address,
            zip_code: game.zip_code,
            city: game.city,
            max_players: game.max_players,
            participantsCount: createdGameCountMap[game.id] || 0,
            price: game.price, // Ajout du prix
            image: '/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png',
            role: 'Organisateur',
            status: isUpcoming ? 'À venir' : 'Terminé',
            team: 'Organisateur',
            result: 'Organisateur'
          };
        });
        
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
      
      // Mettre à jour le compteur de parties jouées
      const { error: updateGamesPlayedError } = await supabase
        .from('user_stats')
        .update({ games_played: pastGamesCount })
        .eq('user_id', userId);
        
      if (updateGamesPlayedError) {
        console.error("Error updating games_played count:", updateGamesPlayedError);
      } else {
        console.log("Updated games_played count to:", pastGamesCount);
      }
      
      // Remove duplicates
      formattedGames = formattedGames.filter((game, index, self) => 
        index === self.findIndex(g => g.id === game.id)
      );
      
      // Sort games: upcoming first, then by date (newest first for each category)
      formattedGames.sort((a, b) => {
        // Upcoming games first
        if (a.status === 'À venir' && b.status !== 'À venir') return -1;
        if (a.status !== 'À venir' && b.status === 'À venir') return 1;
        
        // For games with the same status, sort by date
        return new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime();
      });
      
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
