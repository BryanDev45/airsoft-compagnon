
import { supabase } from '@/integrations/supabase/client';

// Common constants
export const DEFAULT_IMAGE = '/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png';

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
  price: number | null;
  image: string;
  role: string;
  status: 'À venir' | 'Terminé';
  team: string;
  result: string;
  time?: string;
}

export interface RawGame {
  id: string;
  title: string;
  date: string;
  address: string;
  city: string;
  zip_code: string;
  max_players?: number;
  price?: number;
  start_time?: string;
  end_time?: string;
  Picture1?: string;
  Picture2?: string;
  Picture3?: string;
  Picture4?: string;
  Picture5?: string;
  [key: string]: any;
}

export interface GameParticipant {
  game_id: string;
  user_id: string;
  role: string;
  status: string;
}

/**
 * Retrieves participant counts for a list of games
 */
export const fetchParticipantCounts = async (gameIds: string[]): Promise<Record<string, number>> => {
  if (gameIds.length === 0) return {};
  
  const counts: Record<string, number> = {};
  
  // Optimization: get counts in a single query instead of multiple
  for (const gameId of gameIds) {
    const { data, error, count } = await supabase
      .from('game_participants')
      .select('*', { count: 'exact', head: true })
      .eq('game_id', gameId);
    
    if (!error && count !== null) {
      counts[gameId] = count;
    }
  }
  
  return counts;
}

/**
 * Formats an organized game
 */
export const formatCreatedGame = (game: RawGame, participantCount: number): FormattedGame => {
  const gameDate = new Date(game.date);
  const isUpcoming = gameDate > new Date();
  const gameImage = game.Picture1 || game.Picture2 || game.Picture3 || game.Picture4 || game.Picture5 || DEFAULT_IMAGE;
  
  return {
    id: game.id,
    title: game.title,
    date: new Date(game.date).toLocaleDateString('fr-FR'),
    rawDate: game.date,
    location: game.city,
    address: game.address,
    zip_code: game.zip_code,
    city: game.city,
    max_players: game.max_players || 0,
    participantsCount: participantCount,
    price: game.price || 0,
    time: game.start_time && game.end_time 
      ? `${game.start_time.substring(0, 5)} - ${game.end_time.substring(0, 5)}` 
      : undefined,
    image: gameImage,
    role: 'Organisateur',
    status: isUpcoming ? 'À venir' : 'Terminé',
    team: 'Organisateur',
    result: 'Organisateur'
  };
};

/**
 * Formats a game in which the user participates
 */
export const formatParticipatedGame = (game: RawGame, participant: GameParticipant, participantCount: number): FormattedGame => {
  const gameDate = new Date(game.date);
  const isUpcoming = gameDate > new Date();
  const gameImage = game.Picture1 || game.Picture2 || game.Picture3 || game.Picture4 || game.Picture5 || DEFAULT_IMAGE;
  
  return {
    id: game.id,
    title: game.title,
    date: new Date(game.date).toLocaleDateString('fr-FR'),
    rawDate: game.date,
    location: game.city,
    address: game.address,
    zip_code: game.zip_code,
    city: game.city,
    max_players: game.max_players || 0,
    participantsCount: participantCount,
    price: game.price || 0,
    time: game.start_time && game.end_time 
      ? `${game.start_time.substring(0, 5)} - ${game.end_time.substring(0, 5)}` 
      : undefined,
    image: gameImage,
    role: participant.role,
    status: isUpcoming ? 'À venir' : 'Terminé',
    team: 'Indéfini',
    result: participant.status
  };
};
