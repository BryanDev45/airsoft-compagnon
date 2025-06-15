
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FormattedGame, fetchParticipantCounts, formatParticipatedGame, formatCreatedGame, updateUserGamesStats } from './gameFormatters';
import { useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Hook optimisé pour récupérer les parties d'un utilisateur avec mise en cache
 */
export const useUserGamesFetch = (userId: string | undefined, currentUserId?: string | null) => {
  const queryClient = useQueryClient();
  
  // Force la re-exécution de la requête quand l'userId change
  const { data: userGames = [], isLoading: loading, refetch, isSuccess } = useQuery({
    queryKey: ['userGames', userId],
    queryFn: () => fetchUserGames(userId),
    enabled: !!userId,
    staleTime: 30000, // Reduced from 2 minutes to 30 seconds for more frequent updates
    gcTime: 300000, // 5 minutes
    refetchOnWindowFocus: false, // Disabled to reduce requests
    refetchOnMount: true,
    retry: 1,
  });

  // Force la mise à jour des statistiques quand les parties changent
  useEffect(() => {
    // On ne met à jour les stats que si l'utilisateur regarde son propre profil, pour éviter des problèmes de droits RLS
    if (isSuccess && userId && userId === currentUserId && Array.isArray(userGames)) {
      console.log('Déclenchement de la mise à jour des statistiques pour (profil propre):', userId, userGames.length, 'parties');
      updateUserGamesStats(userId, userGames)
        .then(() => {
          // Invalider le cache des user_stats pour forcer le rechargement
          queryClient.invalidateQueries({ queryKey: ['user_stats', userId] });
          queryClient.invalidateQueries({ queryKey: ['profileData', userId] });
        })
        .catch(error => {
          console.error('Erreur lors de la mise à jour des statistiques:', error);
        });
    }
  }, [isSuccess, userId, userGames, queryClient, currentUserId]);

  return {
    userGames,
    loading,
    refetch
  };
};

/**
 * Fonction pour récupérer les jeux d'un utilisateur - VERSION CORRIGÉE
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
    
    console.log(`Parties formatées: ${formattedGames.length} pour l'utilisateur ${userId}`, {
      participated: formattedGames.filter(g => !g.isCreator).length,
      created: formattedGames.filter(g => g.isCreator).length
    });
    
    return formattedGames;
    
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
}
