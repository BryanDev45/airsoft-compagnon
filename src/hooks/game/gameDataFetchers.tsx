
import { supabase } from '@/integrations/supabase/client';
import { GameData } from '@/types/game';
import { Profile } from '@/types/profile';

export const fetchGameData = async (id: string): Promise<GameData | null> => {
  console.log('🎮 GAME DATA - Fetching game data for ID:', id);
  
  const { data: gameData, error: gameError } = await supabase
    .from('airsoft_games')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (gameError) {
    console.error('❌ GAME DATA - Error fetching game data:', gameError);
    throw gameError;
  }
  
  if (!gameData) {
    console.warn('⚠️ GAME DATA - No game found for ID:', id);
    return null;
  }

  console.log('✅ GAME DATA - Game data fetched successfully:', gameData);
  
  let creator: Profile | null = null;
  if (gameData.created_by) {
    try {
      const { data: creatorData, error: creatorError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', gameData.created_by)
        .maybeSingle();
        
      if (creatorError) {
        console.warn("⚠️ GAME DATA - Could not fetch creator profile:", creatorError);
      } else if (creatorData) {
        creator = {
          ...creatorData,
          newsletter_subscribed: creatorData?.newsletter_subscribed ?? null,
          team_logo: null // Ce champ n'existe pas dans la table profiles
        } as Profile;
        console.log('✅ GAME DATA - Creator profile loaded:', creator);
      }
    } catch (error) {
      console.warn("❌ GAME DATA - Error fetching creator profile:", error);
    }
  }
  
  const gameWithCreator: GameData = {
    ...gameData,
    creator
  };
  
  console.log('🎯 GAME DATA - Final game data with creator:', gameWithCreator);
  return gameWithCreator;
};

export const fetchCreatorRating = async (creatorId: string): Promise<number | null> => {
  try {
    const { data: ratingData } = await supabase
      .rpc('get_average_rating', { p_user_id: creatorId });
      
    const rating = ratingData || 0;
    console.log('⭐ CREATOR RATING - Rating for creator:', creatorId, '=', rating);
    
    return rating;
  } catch (error) {
    console.error('❌ CREATOR RATING - Error fetching creator rating:', error);
    return 0;
  }
};
