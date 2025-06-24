
import { useQuery } from '@tanstack/react-query';
import { toast } from "@/components/ui/use-toast";
import { fetchGameData, fetchCreatorRating } from './gameDataFetchers';
import { fetchParticipants } from './participantsFetchers';

export const useGameDataQueries = (id: string | undefined) => {
  console.log('🎮 useGameDataQueries called with ID:', id);

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
        console.error('❌ Game query error:', error);
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
        console.error('❌ Participants query error:', error);
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
    staleTime: 60000,
    gcTime: 300000,
    retry: 1,
    refetchOnWindowFocus: false
  });

  console.log('📊 useGameDataQueries state:', {
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
