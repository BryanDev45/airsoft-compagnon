
import { supabase } from '@/integrations/supabase/client';

export interface FormattedGame {
  id: string;
  title: string;
  date: string;
  rawDate: string;
  location: string;
  address: string;
  zip_code: string;
  city: string;
  max_players: number;
  participantsCount: number;
  price: number;
  image: string;
  role: string;
  status: string;
  team: string;
  result: string;
}

export const fetchParticipantCounts = async (gameIds: string[]): Promise<Record<string, number>> => {
  const counts: Record<string, number> = {};
  
  if (gameIds.length === 0) return counts;
  
  const { data, error } = await supabase
    .from('game_participants')
    .select('game_id')
    .in('game_id', gameIds);
    
  if (error) {
    console.error('Error fetching participant counts:', error);
    return counts;
  }
  
  // Compter les participants par jeu
  data?.forEach(participant => {
    counts[participant.game_id] = (counts[participant.game_id] || 0) + 1;
  });
  
  return counts;
};

export const formatParticipatedGame = (
  gameData: any, 
  participant: any, 
  participantCount: number
): FormattedGame => {
  const gameDate = new Date(gameData.date);
  const isUpcoming = gameDate > new Date();
  
  return {
    id: gameData.id,
    title: gameData.title,
    date: new Date(gameData.date).toLocaleDateString('fr-FR'),
    rawDate: gameData.date,
    location: gameData.city,
    address: gameData.address,
    zip_code: gameData.zip_code,
    city: gameData.city,
    max_players: gameData.max_players,
    participantsCount: participantCount,
    price: gameData.price,
    image: '/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png',
    role: participant.role,
    status: isUpcoming ? 'À venir' : 'Terminé',
    team: 'Indéfini',
    result: participant.status
  };
};

export const formatCreatedGame = (
  game: any, 
  participantCount: number
): FormattedGame => {
  const gameDate = new Date(game.date);
  const isUpcoming = gameDate > new Date();
  
  return {
    id: game.id,
    title: game.title,
    date: new Date(game.date).toLocaleDateString('fr-FR'),
    rawDate: game.date,
    location: game.city,
    address: game.address,
    zip_code: game.zip_code,
    city: game.city,
    max_players: game.max_players,
    participantsCount: participantCount,
    price: game.price,
    image: '/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png',
    role: 'Organisateur',
    status: isUpcoming ? 'À venir' : 'Terminé',
    team: 'Organisateur',
    result: 'Organisateur'
  };
};

// Fonction pour compter et mettre à jour les statistiques de parties jouées
export const updateUserGamesStats = async (userId: string, allGames: FormattedGame[]): Promise<void> => {
  try {
    // Compter uniquement les parties terminées (passées)
    const completedGames = allGames.filter(game => game.status === 'Terminé');
    
    // Compter les parties jouées (en tant que participant OU organisateur)
    const gamesPlayed = completedGames.length;
    
    // Compter les parties organisées
    const gamesOrganized = completedGames.filter(game => game.role === 'Organisateur').length;
    
    console.log(`Updating stats for user ${userId}: played=${gamesPlayed}, organized=${gamesOrganized}`);
    
    // Mettre à jour les statistiques
    const { error } = await supabase
      .from('user_stats')
      .update({ 
        games_played: gamesPlayed,
        games_organized: gamesOrganized 
      })
      .eq('user_id', userId);
      
    if (error) {
      console.error("Error updating user stats:", error);
    } else {
      console.log("Successfully updated user stats");
    }
  } catch (error) {
    console.error("Error in updateUserGamesStats:", error);
  }
};
