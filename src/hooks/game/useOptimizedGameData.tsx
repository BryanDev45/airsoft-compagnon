
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GameData, GameParticipant } from '@/types/game';
import { Profile } from '@/types/profile';
import { toast } from "@/components/ui/use-toast";

interface OptimizedGameData {
  game_data: GameData;
  participants: Array<{
    id: string;
    user_id: string;
    game_id: string;
    status: string;
    role: string;
    created_at: string;
    profile: Profile | null;
  }>;
  creator_profile: Profile;
}

export const useOptimizedGameData = (gameId: string | undefined) => {
  const queryFn = async (): Promise<{
    gameData: GameData | null;
    participants: GameParticipant[];
    creatorProfile: Profile | null;
  }> => {
    if (!gameId) return { gameData: null, participants: [], creatorProfile: null };

    console.log('Fetching optimized game data for:', gameId);
    
    const { data, error } = await supabase.rpc('get_game_with_participants', {
      p_game_id: gameId
    });

    if (error) {
      console.error('Error fetching optimized game data:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('No game found for ID:', gameId);
      return { gameData: null, participants: [], creatorProfile: null };
    }

    const result = data[0] as OptimizedGameData;
    
    // Transform the data to match our existing interfaces
    const gameData: GameData = {
      ...result.game_data,
      creator: result.creator_profile
    };

    const participants: GameParticipant[] = result.participants?.map(p => ({
      id: p.id,
      user_id: p.user_id,
      game_id: p.game_id,
      status: p.status,
      role: p.role,
      created_at: p.created_at,
      profile: p.profile
    })) || [];

    console.log('Optimized game data loaded:', { gameData, participants: participants.length });

    return {
      gameData,
      participants,
      creatorProfile: result.creator_profile
    };
  };

  return useQuery({
    queryKey: ['optimized-game-data', gameId],
    queryFn,
    enabled: !!gameId,
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    meta: {
      errorHandler: (error: any) => {
        console.error('Optimized game query error:', error);
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
};
