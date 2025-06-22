
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FormattedGame, fetchParticipantCounts, formatParticipatedGame, formatCreatedGame } from './gameFormatters';
import { useMemo, useRef, useCallback } from 'react';

/**
 * Hook optimisé pour récupérer les parties d'un utilisateur avec mise en cache
 */
export const useUserGamesFetch = (userId: string | undefined, username: string | undefined, currentUserId?: string | null) => {
  
  // Créer une référence stable pour éviter les re-renders
  const stableUserIdRef = useRef<string | undefined>();
  
  // Seulement mettre à jour la référence si l'userId change réellement
  if (stableUserIdRef.current !== userId) {
    stableUserIdRef.current = userId;
  }
  
  const stableUserId = stableUserIdRef.current;
  
  // Fonction de fetch mémorisée pour éviter les recréations
  const fetchUserGamesCallback = useCallback(
    () => fetchUserGames(stableUserId),
    [stableUserId]
  );
  
  console.log('🔄 useUserGamesFetch called with:', { 
    userId: stableUserId, 
    username, 
    currentUserId,
    timestamp: new Date().toISOString()
  });
  
  const { data: userGames = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['userGames', stableUserId],
    queryFn: fetchUserGamesCallback,
    enabled: !!stableUserId,
    staleTime: 300000, // 5 minutes
    gcTime: 600000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  console.log('🎯 useUserGamesFetch result:', { 
    gamesCount: userGames.length, 
    loading, 
    userId: stableUserId 
  });

  return {
    userGames,
    loading,
    refetch
  };
};

/**
 * Fonction pour récupérer les jeux d'un utilisateur - VERSION OPTIMISÉE
 */
async function fetchUserGames(userId: string | undefined): Promise<FormattedGame[]> {
  if (!userId) return [];
  
  console.log(`📊 Fetching games for user: ${userId}`);
  
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
    
    console.log(`📊 Found ${gameParticipants.length} participations and ${createdGames.length} created games`);
    
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
            // Vérifier si l'utilisateur est aussi le créateur de cette partie
            const isAlsoCreator = gameData.created_by === userId;
            
            // Ne pas ajouter la partie si l'utilisateur est le créateur (sera ajoutée dans les parties créées)
            if (!isAlsoCreator) {
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
    
    // Supprimer les doublons basés sur l'ID (au cas où)
    formattedGames = formattedGames.filter((game, index, self) => 
      index === self.findIndex(g => g.id === game.id)
    );
    
    // Trier: à venir d'abord, puis par date (les plus récentes en premier)
    formattedGames.sort((a, b) => {
      if (a.status === 'À venir' && b.status !== 'À venir') return -1;
      if (a.status !== 'À venir' && b.status === 'À venir') return 1;
      return new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime();
    });
    
    console.log(`📊 Successfully formatted ${formattedGames.length} games`);
    return formattedGames;
    
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
}
