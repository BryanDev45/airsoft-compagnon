
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { GameData, GameParticipant } from '@/types/game';
import { Profile } from '@/types/profile';
import { useAuth } from '@/hooks/useAuth';

export const useGameData = (id: string | undefined) => {
  const { user } = useAuth();
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [participants, setParticipants] = useState<GameParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [creatorRating, setCreatorRating] = useState<number | null>(null);
  const [creatorProfile, setCreatorProfile] = useState<Profile | null>(null);

  const loadGameData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const { data: gameData, error: gameError } = await supabase
        .from('airsoft_games')
        .select('*')
        .eq('id', id)
        .single();

      if (gameError) {
        throw gameError;
      }
      
      let creator: Profile | null = null;
      if (gameData.created_by) {
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
          
          setCreatorProfile(creator);
        }
        
        if (gameData.created_by) {
          const { data: ratingData } = await supabase
            .rpc('get_average_rating', { p_user_id: gameData.created_by });
            
          setCreatorRating(ratingData);
        }
      }
      
      const gameWithCreator: GameData = {
        ...gameData,
        creator
      };
      
      setGameData(gameWithCreator);
      
    } catch (error) {
      console.error('Error loading game data:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les informations de la partie."
      });
    } finally {
      setLoading(false);
    }
  };

  const loadParticipants = async () => {
    if (!id) return;

    try {
      const { data: participants, error } = await supabase
        .from('game_participants')
        .select('*')
        .eq('game_id', id);

      if (error) throw error;

      const participantsWithProfiles = await Promise.all(
        participants.map(async (participant) => {
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
        })
      );

      setParticipants(participantsWithProfiles);
      
      if (user) {
        const isUserRegistered = participantsWithProfiles.some(p => p.user_id === user.id);
        setIsRegistered(isUserRegistered);
      }

    } catch (error) {
      console.error('Error loading participants:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des participants."
      });
    }
  };

  useEffect(() => {
    if (id) {
      loadGameData();
      loadParticipants();
    }
  }, [id, user]);

  return {
    gameData,
    participants,
    loading,
    isRegistered,
    creatorRating,
    creatorProfile,
    loadParticipants
  };
};
