
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { GameData, GameParticipant } from '@/types/game';
import { Profile } from '@/types/profile';
import { getStorageWithExpiry, setStorageWithExpiry, CACHE_DURATIONS } from '@/utils/cacheUtils';

const fetchGameData = async (id: string): Promise<GameData | null> => {
  console.log('Fetching game data for ID:', id);
  
  const { data: gameData, error: gameError } = await supabase
    .from('airsoft_games')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (gameError) {
    console.error('Error fetching game data:', gameError);
    throw gameError;
  }
  
  if (!gameData) {
    console.warn('No game found for ID:', id);
    return null;
  }

  console.log('Game data fetched successfully:', gameData);
  
  let creator: Profile | null = null;
  if (gameData.created_by) {
    try {
      const { data: creatorData, error: creatorError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', gameData.created_by)
        .maybeSingle();
        
      if (creatorError) {
        console.warn("Could not fetch creator profile:", creatorError);
      } else if (creatorData) {
        const creatorDataAny = creatorData as any;
        creator = {
          ...creatorDataAny,
          newsletter_subscribed: creatorDataAny?.newsletter_subscribed ?? null,
          team_logo: creatorDataAny?.team_logo ?? null
        } as Profile;
        console.log('Creator profile loaded:', creator);
      }
    } catch (error) {
      console.warn("Error fetching creator profile:", error);
    }
  }
  
  const gameWithCreator: GameData = {
    ...gameData,
    creator
  };
  
  console.log('Final game data with creator:', gameWithCreator);
  return gameWithCreator;
};

const fetchParticipants = async (gameId: string): Promise<GameParticipant[]> => {
  console.log('Fetching participants for game:', gameId);
  
  const { data: participants, error } = await supabase
    .from('game_participants')
    .select('*')
    .eq('game_id', gameId);

  if (error) {
    console.error('Error fetching participants:', error);
    throw error;
  }

  console.log('Participants fetched:', participants?.length || 0);

  const participantsWithProfiles = await Promise.all(
    (participants || []).map(async (participant) => {
      try {
        // Récupérer le profil complet avec les informations d'équipe
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(`
            *,
            teams!profiles_team_id_fkey (
              id,
              name,
              logo
            )
          `)
          .eq('id', participant.user_id)
          .maybeSingle();

        if (profileError || !profileData) {
          console.warn('Error fetching participant profile:', profileError);
          return {
            ...participant,
            profile: null
          } as GameParticipant;
        }

        // Construire le profil avec les informations d'équipe
        const profile: Profile = {
          ...(profileData as any),
          newsletter_subscribed: profileData?.newsletter_subscribed ?? null,
          team_logo: profileData?.teams?.logo ?? null,
          // S'assurer que le nom de l'équipe est correctement défini
          team: profileData.team || (profileData as any).teams?.name || null
        };

        console.log('Participant profile with team info:', {
          username: profile.username,
          team_field: profile.team,
          team_id: profile.team_id,
          teams_relation: (profileData as any).teams
        });

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

  console.log('Participants with profiles loaded:', participantsWithProfiles.length);
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
  console.log('useGameDataQueries called with ID:', id);

  const gameQuery = useQuery({
    queryKey: ['gameData', id],
    queryFn: () => fetchGameData(id!),
    enabled: !!id,
    staleTime: 30000,
    gcTime: 300000,
    retry: 2, // Augmenter les tentatives
    refetchOnWindowFocus: false,
    refetchInterval: false,
    meta: {
      errorHandler: (error: any) => {
        console.error('Game query error:', error);
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
    enabled: !!id && !!gameQuery.data, // Attendre que les données de jeu soient chargées
    staleTime: 15000,
    gcTime: 300000,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchInterval: 30000,
    meta: {
      errorHandler: (error: any) => {
        console.error('Participants query error:', error);
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

  console.log('useGameDataQueries state:', {
    gameLoading: gameQuery.isLoading,
    gameIsPending: gameQuery.isPending,
    participantsLoading: participantsQuery.isLoading,
    gameError: gameQuery.error,
    participantsError: participantsQuery.error,
    gameData: !!gameQuery.data,
    gameDataNull: gameQuery.data === null,
    gameDataUndefined: gameQuery.data === undefined,
    participants: participantsQuery.data?.length || 0,
    queryEnabled: !!id
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
