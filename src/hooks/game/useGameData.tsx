
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

  console.log('useGameData hook called with ID:', id);

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

  console.log('useGameData: Raw data from queries:', { gameData, participants, gameLoading, participantsLoading, gameError, participantsError });

  // Charger le profil de l'utilisateur connecté
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        console.log('Fetching user profile for:', user.id);
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          console.log('User profile loaded:', profile);
          // Construire le profil avec toutes les propriétés requises par le type Profile
          const completeProfile: Profile = {
            id: profile.id,
            username: profile.username,
            email: profile.email,
            firstname: profile.firstname,
            lastname: profile.lastname,
            birth_date: profile.birth_date,
            age: profile.age,
            join_date: profile.join_date,
            avatar: profile.avatar,
            banner: profile.banner,
            bio: profile.bio,
            location: profile.location,
            phone_number: profile.phone_number,
            team: profile.team,
            team_id: profile.team_id,
            team_logo: null,
            is_team_leader: profile.is_team_leader,
            is_verified: profile.is_verified,
            newsletter_subscribed: profile.newsletter_subscribed ?? null,
            Admin: profile.Admin,
            Ban: profile.Ban,
            ban_date: profile.ban_date,
            ban_reason: profile.ban_reason,
            banned_by: profile.banned_by,
            reputation: profile.reputation,
            friends_list_public: profile.friends_list_public,
            spoken_language: profile.spoken_language
          };

          // Si l'utilisateur a une équipe, charger le logo de l'équipe
          if (profile.team_id) {
            const { data: teamData } = await supabase
              .from('teams')
              .select('logo')
              .eq('id', profile.team_id)
              .single();
            
            if (teamData?.logo) {
              completeProfile.team_logo = teamData.logo;
            }
          }

          setUserProfile(completeProfile);
        }
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  // Vérifier si l'utilisateur est inscrit
  useEffect(() => {
    console.log('Checking user registration status:', { user: user?.id, participantsLength: participants.length });
    if (user && participants.length >= 0) {
      const isUserRegistered = participants.some(p => p.user_id === user.id);
      console.log('User registration check result:', isUserRegistered);
      setIsRegistered(isUserRegistered);
    } else if (!user) {
      setIsRegistered(false);
    }
  }, [user, participants]);

  // Définir le profil du créateur
  useEffect(() => {
    if (gameData?.creator) {
      console.log('Setting creator profile:', gameData.creator);
      setCreatorProfile(gameData.creator);
    }
  }, [gameData]);

  // Améliorer la logique de chargement - considérer que les données sont chargées seulement si on a une réponse définitive
  const loading = gameLoading || (participantsLoading && gameData !== null);
  const error = gameError || participantsError;

  console.log('useGameData final state:', {
    gameData: !!gameData,
    gameDataValue: gameData,
    participants: participants.length,
    loading,
    error,
    isRegistered,
    creatorRating,
    gameLoading,
    participantsLoading
  });

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
