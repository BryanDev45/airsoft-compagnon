
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { GameData, GameParticipant } from '@/types/game';
import { Profile } from '@/types/profile';
import { getStorageWithExpiry, setStorageWithExpiry, CACHE_DURATIONS } from '@/utils/cacheUtils';

const fetchGameData = async (id: string): Promise<GameData | null> => {
  console.log('Fetching fresh game data for game:', id);
  
  const { data: gameData, error: gameError } = await supabase
    .from('airsoft_games')
    .select('*')
    .eq('id', id)
    .single();

  if (gameError) {
    console.error('Error fetching game data:', gameError);
    throw gameError;
  }
  
  let creator: Profile | null = null;
  if (gameData.created_by) {
    try {
      const { data: creatorData, error: creatorError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', gameData.created_by)
        .single();
        
      if (creatorError) {
        console.warn("Could not fetch creator profile:", creatorError);
      } else {
        const creatorDataAny = creatorData as any;
        creator = {
          ...creatorDataAny,
          newsletter_subscribed: creatorDataAny?.newsletter_subscribed ?? null,
          team_logo: creatorDataAny?.team_logo ?? null
        } as Profile;
      }
    } catch (error) {
      console.warn("Error fetching creator profile:", error);
    }
  }
  
  const gameWithCreator: GameData = {
    ...gameData,
    creator
  };
  
  return gameWithCreator;
};

const fetchParticipants = async (gameId: string): Promise<GameParticipant[]> => {
  console.log('Fetching fresh participants data for game:', gameId);
  
  const { data: participants, error } = await supabase
    .from('game_participants')
    .select('*')
    .eq('game_id', gameId);

  if (error) {
    console.error('Error fetching participants:', error);
    throw error;
  }

  const participantsWithProfiles = await Promise.all(
    (participants || []).map(async (participant) => {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', participant.user_id)
          .single();

        const profile = profileError ? null : {
          ...(profileData as any),
          newsletter_subscribed: profileData?.newsletter_subscribed ?? null
        } as Profile;

        return {
          ...participant,
          profile
        } as GameParticipant;
      } catch (error) {
        console.warn('Error fetching participant profile:', error);
        return {
          ...participant,
          profile: null
        } as GameParticipant;
      }
    })
  );

  return participantsWithProfiles;
};

const fetchCreatorRating = async (creatorId: string): Promise<number | null> => {
  const cacheKey = `creator_rating_${creatorId}`;
  
  const cachedRating = getStorageWithExpiry(cacheKey);
  if (cachedRating !== null) {
    console.log('Using cached creator rating for user:', creatorId);
    return cachedRating;
  }

  try {
    const { data: ratingData } = await supabase
      .rpc('get_average_rating', { p_user_id: creatorId });
      
    const rating = ratingData || 0;
    
    setStorageWithExpiry(cacheKey, rating, CACHE_DURATIONS.MEDIUM);
    
    return rating;
  } catch (error) {
    console.error('Error fetching creator rating:', error);
    return 0;
  }
};

export const useGameDataQueries = (id: string | undefined) => {
  const gameQuery = useQuery({
    queryKey: ['gameData', id],
    queryFn: () => fetchGameData(id!),
    enabled: !!id,
    staleTime: 30000, // Increased from 1s to 30s
    gcTime: 300000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false, // Disabled to reduce requests
    refetchInterval: false, // Disabled automatic polling
    meta: {
      errorHandler: (error: any) => {
        if (error.message !== "Failed to fetch") {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger les informations de la partie."
          });
        }
      }
    }
  });

  const participantsQuery = useQuery({
    queryKey: ['gameParticipants', id],
    queryFn: () => fetchParticipants(id!),
    enabled: !!id,
    staleTime: 15000, // Increased from 1s to 15s
    gcTime: 300000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false, // Disabled to reduce requests
    refetchInterval: 30000, // Reduced from 5s to 30s
    meta: {
      errorHandler: (error: any) => {
        if (error.message !== "Failed to fetch") {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger la liste des participants."
          });
        }
      }
    }
  });

  const creatorRatingQuery = useQuery({
    queryKey: ['creatorRating', gameQuery.data?.created_by],
    queryFn: () => fetchCreatorRating(gameQuery.data!.created_by),
    enabled: !!gameQuery.data?.created_by,
    staleTime: CACHE_DURATIONS.MEDIUM,
    gcTime: CACHE_DURATIONS.LONG,
    retry: 1,
    refetchOnWindowFocus: false
  });

  return {
    gameData: gameQuery.data || null,
    participants: participantsQuery.data || [],
    creatorRating: creatorRatingQuery.data || null,
    gameLoading: gameQuery.isLoading,
    participantsLoading: participantsQuery.isLoading,
    gameError: gameQuery.error,
    participantsError: participantsQuery.error,
    refetchParticipants: participantsQuery.refetch
  };
};
