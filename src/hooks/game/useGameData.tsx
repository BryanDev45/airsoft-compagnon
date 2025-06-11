
import { useState, useEffect } from 'react';
import { Profile } from '@/types/profile';
import { useAuth } from '@/hooks/useAuth';
import { useGameDataQueries } from './useGameDataQueries';

export const useGameData = (id: string | undefined) => {
  const { user } = useAuth();
  const [isRegistered, setIsRegistered] = useState(false);
  const [creatorProfile, setCreatorProfile] = useState<Profile | null>(null);

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
    loadParticipants: refetchParticipants
  };
};
