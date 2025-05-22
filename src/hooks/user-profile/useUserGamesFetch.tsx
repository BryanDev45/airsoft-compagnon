
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FormattedGame, fetchParticipantCounts, formatParticipatedGame, formatCreatedGame } from './gameFormatters';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook optimisé pour récupérer les parties d'un utilisateur avec mise en cache
 */
export const useUserGamesFetch = (userId: string | undefined) => {
  // Utilise React Query pour le caching et l'optimisation
  const { data: userGames = [], isLoading: loading } = useQuery({
    queryKey: ['userGames', userId],
    queryFn: () => fetchUserGames(userId),
    enabled: !!userId,
    staleTime: 60000, // Cache valide pendant 1 minute
    refetchOnWindowFocus: false
  });

  return {
    userGames,
    loading
  };
};

/**
 * Fonction pour récupérer les jeux d'un utilisateur
 */
async function fetchUserGames(userId: string | undefined): Promise<FormattedGame[]> {
  if (!userId) return [];
  
  try {
    // Exécute les requêtes en parallèle pour de meilleures performances
    const [participantsResult, createdGamesResult] = await Promise.all([
      supabase.from('game_participants').select('*').eq('user_id', userId),
      supabase.from('airsoft_games').select('*').eq('created_by', userId)
    ]);

    if (participantsResult.error) throw participantsResult.error;
    if (createdGamesResult.error) throw createdGamesResult.error;

    const gameParticipants = participantsResult.data || [];
    const createdGames = createdGamesResult.data || [];
    
    // Traiter les jeux participés
    let formattedGames: FormattedGame[] = [];
    let pastGamesCount = 0;
    
    if (gameParticipants.length > 0) {
      const participatedGameIds = gameParticipants.map(p => p.game_id);
      
      // Récupérer les détails des jeux dans une seule requête
      const { data: participatedGames, error: gamesError } = await supabase
        .from('airsoft_games')
        .select('*')
        .in('id', participatedGameIds);
        
      if (gamesError) throw gamesError;
      
      if (participatedGames && participatedGames.length > 0) {
        // Obtenir les compteurs de participants plus efficacement
        const participantCounts = await fetchParticipantCounts(participatedGameIds);
        
        // Formater les jeux auxquels l'utilisateur participe
        for (const participant of gameParticipants) {
          const gameData = participatedGames.find(g => g.id === participant.game_id);
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
    
    // Traiter les jeux créés
    if (createdGames.length > 0) {
      const createdIds = createdGames.map(g => g.id);
      const createdCounts = await fetchParticipantCounts(createdIds);
      
      // Formater les jeux créés par l'utilisateur
      for (const game of createdGames) {
        formattedGames.push(
          formatCreatedGame(
            game, 
            createdCounts[game.id] || 0
          )
        );
      }
      
      // Mettre à jour les statistiques pour les jeux organisés
      try {
        await supabase
          .from('user_stats')
          .update({ games_organized: createdGames.length })
          .eq('user_id', userId);
          
        console.log("Updated games_organized count to:", createdGames.length);
      } catch (error) {
        console.error("Error updating games_organized count:", error);
      }
    }
    
    // Mettre à jour le compteur de parties jouées
    try {
      await supabase
        .from('user_stats')
        .update({ games_played: pastGamesCount })
        .eq('user_id', userId);
        
      console.log("Updated games_played count to:", pastGamesCount);
    } catch (error) {
      console.error("Error updating games_played count:", error);
    }
    
    // Supprimer les doublons
    formattedGames = formattedGames.filter((game, index, self) => 
      index === self.findIndex(g => g.id === game.id)
    );
    
    // Trier: à venir d'abord, puis par date (les plus récentes en premier)
    formattedGames.sort((a, b) => {
      if (a.status === 'À venir' && b.status !== 'À venir') return -1;
      if (a.status !== 'À venir' && b.status === 'À venir') return 1;
      return new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime();
    });
    
    return formattedGames;
    
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
}
