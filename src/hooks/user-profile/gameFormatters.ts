
import { supabase } from '@/integrations/supabase/client';

export interface FormattedGame {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  maxParticipants: number;
  status: string;
  type: string;
  role?: string;
  rawDate: string;
  isCreator?: boolean;
}

/**
 * Récupère efficacement les compteurs de participants pour plusieurs parties
 */
export const fetchParticipantCounts = async (gameIds: string[]): Promise<{ [key: string]: number }> => {
  if (gameIds.length === 0) return {};
  
  try {
    const { data, error } = await supabase
      .from('game_participants')
      .select('game_id')
      .in('game_id', gameIds)
      .eq('status', 'Confirmé');
    
    if (error) throw error;
    
    // Compter les participants par partie
    const counts: { [key: string]: number } = {};
    data?.forEach(participant => {
      counts[participant.game_id] = (counts[participant.game_id] || 0) + 1;
    });
    
    return counts;
  } catch (error) {
    console.error('Erreur lors du comptage des participants:', error);
    return {};
  }
};

/**
 * Formate une partie à laquelle l'utilisateur participe
 */
export const formatParticipatedGame = (gameData: any, participant: any, participantCount: number): FormattedGame => {
  const gameDate = new Date(gameData.date);
  const currentDate = new Date();
  
  let status = 'Terminée';
  if (gameDate > currentDate) {
    status = 'À venir';
  } else if (gameDate.toDateString() === currentDate.toDateString()) {
    status = 'En cours';
  }
  
  return {
    id: gameData.id,
    title: gameData.title,
    date: gameDate.toLocaleDateString('fr-FR'),
    time: `${gameData.start_time.slice(0, 5)} - ${gameData.end_time.slice(0, 5)}`,
    location: `${gameData.city}, ${gameData.zip_code}`,
    participants: participantCount,
    maxParticipants: gameData.max_players,
    status,
    type: gameData.game_type,
    role: participant.role || 'Participant',
    rawDate: gameData.date,
    isCreator: false
  };
};

/**
 * Formate une partie créée par l'utilisateur
 */
export const formatCreatedGame = (gameData: any, participantCount: number): FormattedGame => {
  const gameDate = new Date(gameData.date);
  const currentDate = new Date();
  
  let status = 'Terminée';
  if (gameDate > currentDate) {
    status = 'À venir';
  } else if (gameDate.toDateString() === currentDate.toDateString()) {
    status = 'En cours';
  }
  
  return {
    id: gameData.id,
    title: gameData.title,
    date: gameDate.toLocaleDateString('fr-FR'),
    time: `${gameData.start_time.slice(0, 5)} - ${gameData.end_time.slice(0, 5)}`,
    location: `${gameData.city}, ${gameData.zip_code}`,
    participants: participantCount,
    maxParticipants: gameData.max_players,
    status,
    type: gameData.game_type,
    role: 'Organisateur',
    rawDate: gameData.date,
    isCreator: true
  };
};

/**
 * Met à jour les statistiques de jeu d'un utilisateur spécifique
 */
export const updateUserGamesStats = async (userId: string, games: FormattedGame[]): Promise<void> => {
  if (!userId || games.length === 0) return;
  
  try {
    // Calculer les statistiques
    const gamesPlayed = games.filter(game => game.status === 'Terminée').length;
    const gamesOrganized = games.filter(game => game.isCreator && game.status === 'Terminée').length;
    
    console.log(`Mise à jour des statistiques pour l'utilisateur ${userId}:`, {
      gamesPlayed,
      gamesOrganized,
      totalGames: games.length
    });
    
    // Mettre à jour les statistiques dans la base de données pour l'utilisateur spécifique
    const { error } = await supabase
      .from('user_stats')
      .upsert({
        user_id: userId,
        games_played: gamesPlayed,
        games_organized: gamesOrganized,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });
    
    if (error) {
      console.error('Erreur lors de la mise à jour des statistiques:', error);
    } else {
      console.log('Statistiques mises à jour avec succès');
    }
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques:', error);
  }
};
