
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
  console.log('🔥 PARTICIPANTS - Starting fetch for game:', gameId);
  
  const { data: participants, error } = await supabase
    .from('game_participants')
    .select('*')
    .eq('game_id', gameId);

  if (error) {
    console.error('❌ PARTICIPANTS - Error fetching participants:', error);
    throw error;
  }

  console.log('✅ PARTICIPANTS - Raw participants fetched:', participants?.length || 0);

  const participantsWithProfiles = await Promise.all(
    (participants || []).map(async (participant, index) => {
      console.log(`🔍 PARTICIPANT ${index + 1} - Processing user_id:`, participant.user_id);
      
      try {
        // Step 1: Get basic profile data
        const { data: basicProfile, error: basicProfileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', participant.user_id)
          .maybeSingle();

        if (basicProfileError || !basicProfile) {
          console.warn(`⚠️ PARTICIPANT ${index + 1} - Error fetching basic profile:`, basicProfileError);
          return {
            ...participant,
            profile: null
          } as GameParticipant;
        }

        console.log(`📋 PARTICIPANT ${index + 1} - Basic profile:`, {
          username: basicProfile.username,
          team_field: basicProfile.team,
          team_id: basicProfile.team_id
        });

        // Step 2: Get team data if team_id exists
        let teamData = null;
        if (basicProfile.team_id) {
          console.log(`🏢 PARTICIPANT ${index + 1} - Fetching team data for team_id:`, basicProfile.team_id);
          
          const { data: team, error: teamError } = await supabase
            .from('teams')
            .select('id, name, logo')
            .eq('id', basicProfile.team_id)
            .maybeSingle();

          if (teamError) {
            console.warn(`⚠️ PARTICIPANT ${index + 1} - Error fetching team:`, teamError);
          } else if (team) {
            teamData = team;
            console.log(`✅ PARTICIPANT ${index + 1} - Team data found:`, teamData);
          } else {
            console.log(`❌ PARTICIPANT ${index + 1} - No team found for team_id:`, basicProfile.team_id);
          }
        }

        // Step 3: Build the complete profile with team information
        const profile: Profile = {
          ...basicProfile,
          newsletter_subscribed: basicProfile?.newsletter_subscribed ?? null,
          // Prioritize team name from team relation, then from profile.team field
          team: teamData?.name || basicProfile.team || null,
          team_logo: teamData?.logo || null
        };

        console.log(`🎯 PARTICIPANT ${index + 1} - Final profile built:`, {
          username: profile.username,
          team_from_relation: teamData?.name,
          team_from_profile: basicProfile.team,
          final_team: profile.team,
          team_logo: profile.team_logo,
          team_id: profile.team_id
        });

        return {
          ...participant,
          profile
        } as GameParticipant;
      } catch (error) {
        console.error(`❌ PARTICIPANT ${index + 1} - Unexpected error:`, error);
        return {
          ...participant,
          profile: null
        } as GameParticipant;
      }
    })
  );

  console.log('🏁 PARTICIPANTS - Final participants with profiles:', participantsWithProfiles.length);
  
  // Log summary of team information
  const teamSummary = participantsWithProfiles.map((p, i) => ({
    participant: i + 1,
    username: p.profile?.username,
    team: p.profile?.team,
    team_id: p.profile?.team_id
  }));
  console.log('📊 PARTICIPANTS - Team summary:', teamSummary);
  
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
    retry: 2,
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
    enabled: !!id && !!gameQuery.data,
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
