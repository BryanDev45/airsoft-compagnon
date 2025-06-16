
import { useState, useEffect } from 'react';
import { Profile } from '@/types/profile';
import { useAuth } from '@/hooks/useAuth';
import { useGameDataQueries } from './useGameDataQueries';
import { supabase } from '@/integrations/supabase/client';

export const useGameData = (id: string | undefined) => {
  const { user } = useAuth();
  const [isRegistered, setIsRegistered] = useState(false);
  const [creatorProfile, setCreatorProfile] = useState<Profile | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  const {
    gameData,
    participants,
    creatorRating,
    gameLoading,
    participantsLoading,
    gameError,
    participantsError,
    refetchParticipants
  } = useGameDataQueries(id);

  // Charger le profil de l'utilisateur connecté
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserProfile(profile);
        }
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  // Vérifier si l'utilisateur est inscrit
  useEffect(() => {
    if (user && participants.length >= 0) {
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
    userProfile,
    loadParticipants: refetchParticipants
  };
};
