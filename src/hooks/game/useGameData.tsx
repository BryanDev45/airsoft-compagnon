
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { GameData, GameParticipant } from '@/types/game';
import { Profile } from '@/types/profile';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
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
  
  // Vérifier le cache d'abord
  const cachedRating = getStorageWithExpiry(cacheKey);
  if (cachedRating !== null) {
    console.log('Using cached creator rating for user:', creatorId);
    return cachedRating;
  }

  try {
    const { data: ratingData } = await supabase
      .rpc('get_average_rating', { p_user_id: creatorId });
      
    const rating = ratingData || 0;
    
    // Mettre en cache pour 30 minutes
    setStorageWithExpiry(cacheKey, rating, CACHE_DURATIONS.MEDIUM);
    
    return rating;
  } catch (error) {
    console.error('Error fetching creator rating:', error);
    return 0;
  }
};

export const useGameData = (id: string | undefined) => {
  const { user } = useAuth();
  const [isRegistered, setIsRegistered] = useState(false);
  const [creatorProfile, setCreatorProfile] = useState<Profile | null>(null);

  // Utiliser React Query pour les données de jeu avec cache réduit
  const { 
    data: gameData = null, 
    isLoading: gameLoading, 
    error: gameError 
  } = useQuery({
    queryKey: ['gameData', id],
    queryFn: () => fetchGameData(id!),
    enabled: !!id,
    staleTime: 1000, // 1 seconde seulement
    gcTime: 30000, // 30 secondes
    retry: 1,
    refetchOnWindowFocus: true, // Refetch quand on revient sur la fenêtre
    refetchInterval: 5000, // Refetch toutes les 5 secondes
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

  // Utiliser React Query pour les participants avec cache réduit
  const { 
    data: participants = [], 
    isLoading: participantsLoading,
    error: participantsError,
    refetch: refetchParticipants
  } = useQuery({
    queryKey: ['gameParticipants', id],
    queryFn: () => fetchParticipants(id!),
    enabled: !!id,
    staleTime: 1000, // 1 seconde seulement
    gcTime: 30000, // 30 secondes
    retry: 1,
    refetchOnWindowFocus: true, // Refetch quand on revient sur la fenêtre
    refetchInterval: 5000, // Refetch toutes les 5 secondes
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

  // Utiliser React Query pour la note du créateur
  const { 
    data: creatorRating = null 
  } = useQuery({
    queryKey: ['creatorRating', gameData?.created_by],
    queryFn: () => fetchCreatorRating(gameData!.created_by),
    enabled: !!gameData?.created_by,
    staleTime: CACHE_DURATIONS.MEDIUM, // 30 minutes
    gcTime: CACHE_DURATIONS.LONG, // 24 heures
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Vérifier si l'utilisateur est inscrit
  useEffect(() => {
    if (user && participants.length >= 0) { // Changé de > 0 à >= 0
      const isUserRegistered = participants.some(p => p.user_id === user.id);
      console.log('Checking user registration:', user.id, 'in participants:', participants.map(p => p.user_id), 'result:', isUserRegistered);
      setIsRegistered(isUserRegistered);
    } else if (!user) {
      setIsRegistered(false);
    }
  }, [user, participants]);

  // Définir le profil du créateur
  useEffect(() => {
    if (gameData?.creator) {
      setCreatorProfile(gameData.creator);
    }
  }, [gameData]);

  const loading = gameLoading || participantsLoading;
  const error = gameError || participantsError;

  return {
    gameData,
    participants,
    loading,
    isRegistered,
    creatorRating,
    creatorProfile,
    loadParticipants: refetchParticipants
  };
};
