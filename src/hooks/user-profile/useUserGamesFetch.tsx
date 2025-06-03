
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FormattedGame, fetchParticipantCounts, formatParticipatedGame, formatCreatedGame, updateUserGamesStats } from './gameFormatters';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook optimisé pour récupérer les parties d'un utilisateur avec mise en cache
 */
export const useUserGamesFetch = (userId: string | undefined) => {
  // Force la re-exécution de la requête quand l'userId change
  const { data: userGames = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['userGames', userId],
    queryFn: () => fetchUserGames(userId),
    enabled: !!userId,
    staleTime: 30000, // Réduire le cache pour forcer les mises à jour plus fréquentes
    refetchOnWindowFocus: true, // Actualiser quand on revient sur la fenêtre
    refetchOnMount: true // Toujours actualiser au montage
  });

  // Force la mise à jour des statistiques quand les parties changent
  useEffect(() => {
    if (userId && userGames.length >= 0) {
      updateUserGamesStats(userId, userGames);
    }
  }, [userId, userGames]);

  return {
    userGames,
    loading,
    refetch
  };
};

/**
 * Fonction pour récupérer les jeux d'un utilisateur
 */
async function fetchUserGames(userId: string | undefined): Promise<FormattedGame[]> {
  if (!userId) return [];
  
  try {
    console.log(`Récupération des parties pour l'utilisateur: ${userId}`);
    
    // Exécute les requêtes en parallèle pour de meilleures performances
    const [participantsResult, createdGamesResult] = await Promise.all([
      supabase.from('game_participants').select('*').eq('user_id', userId),
      supabase.from('airsoft_games').select('*').eq('created_by', userId)
    ]);

    if (participantsResult.error) throw participantsResult.error;
    if (createdGamesResult.error) throw createdGamesResult.error;

    const gameParticipants = participantsResult.data || [];
    const createdGames = createdGamesResult.data || [];
    
    console.log(`Trouvé ${gameParticipants.length} participations et ${createdGames.length} parties créées`);
    
    // Traiter les jeux participés
    let formattedGames: FormattedGame[] = [];
    
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
      
      for (const game of createdGames) {
        formattedGames.push(
          formatCreatedGame(
            game, 
            createdCounts[game.id] || 0
          )
        );
      }
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
    
    console.log(`Parties formatées: ${formattedGames.length} pour l'utilisateur ${userId}`);
    
    return formattedGames;
    
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
}
