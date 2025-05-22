
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FormattedGame, fetchParticipantCounts, formatParticipatedGame, formatCreatedGame } from './gameFormatters';

/**
 * Hook pour récupérer et mettre à jour les parties d'un utilisateur avec des fonctionnalités supplémentaires
 */
export const useUserGames = (userId: string | undefined) => {
  const [userGames, setUserGames] = useState<FormattedGame[]>([]);

  /**
   * Récupérer les parties d'un utilisateur avec possibilité de rafraîchir manuellement
   */
  const fetchUserGames = async () => {
    if (!userId) return;
    
    try {
      // Récupérer les données en parallèle pour de meilleures performances
      const [participantsResponse, createdGamesResponse] = await Promise.all([
        supabase.from('game_participants').select('*').eq('user_id', userId),
        supabase.from('airsoft_games').select('*').eq('created_by', userId)
      ]);
      
      if (participantsResponse.error) throw participantsResponse.error;
      if (createdGamesResponse.error) throw createdGamesResponse.error;
      
      const gameParticipants = participantsResponse.data || [];
      const createdGames = createdGamesResponse.data || [];
      
      let formattedGames: FormattedGame[] = [];
      let pastGamesCount = 0;
      
      // Traiter les parties auxquelles l'utilisateur participe
      if (gameParticipants.length > 0) {
        const gameIds = gameParticipants.map(gp => gp.game_id);
        
        if (gameIds.length > 0) {
          const { data: games, error: gamesDataError } = await supabase
            .from('airsoft_games')
            .select('*')
            .in('id', gameIds);
          
          if (gamesDataError) throw gamesDataError;
          
          if (games && games.length > 0) {
            // Récupérer les compteurs de participants de manière optimisée
            const participantCounts = await fetchParticipantCounts(gameIds);
            
            // Formater les jeux participés
            for (const participant of gameParticipants) {
              const gameData = games.find(g => g.id === participant.game_id);
              if (gameData) {
                const gameDate = new Date(gameData.date);
                
                // Compter les parties passées
                if (gameDate <= new Date()) {
                  pastGamesCount++;
                }
                
                formattedGames.push(
                  formatParticipatedGame(
                    gameData, 
                    participant, 
                    participantCounts[gameData.id] || 0
                  )
                );
              }
            }
          }
        }
      }
      
      // Traiter les parties créées par l'utilisateur
      if (createdGames.length > 0) {
        const createdIds = createdGames.map(g => g.id);
        const createdCounts = await fetchParticipantCounts(createdIds);
        
        // Formater les parties créées
        for (const game of createdGames) {
          formattedGames.push(
            formatCreatedGame(
              game, 
              createdCounts[game.id] || 0
            )
          );
        }
      }
      
      // Mettre à jour les compteurs dans user_stats
      await Promise.all([
        // Mettre à jour le nombre de parties organisées
        createdGames.length > 0 
          ? supabase
              .from('user_stats')
              .update({ games_organized: createdGames.length })
              .eq('user_id', userId)
          : Promise.resolve(),
        
        // Mettre à jour le nombre de parties jouées
        supabase
          .from('user_stats')
          .update({ games_played: pastGamesCount })
          .eq('user_id', userId)
      ]).catch(error => console.error("Error updating user stats:", error));
      
      // Supprimer les doublons
      formattedGames = formattedGames.filter((game, index, self) => 
        index === self.findIndex(g => g.id === game.id)
      );
      
      // Trier: à venir d'abord, puis par date
      formattedGames.sort((a, b) => {
        if (a.status === 'À venir' && b.status !== 'À venir') return -1;
        if (a.status !== 'À venir' && b.status === 'À venir') return 1;
        return new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime();
      });
      
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
