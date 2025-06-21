
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOptimizedGameData } from './useOptimizedGameData';
import { Profile } from '@/types/profile';
import { supabase } from '@/integrations/supabase/client';

export const useGameData = (gameId: string | undefined) => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  
  const {
    data: optimizedData,
    isLoading: loading,
    error,
    refetch
  } = useOptimizedGameData(gameId);

  const gameData = optimizedData?.gameData || null;
  const participants = optimizedData?.participants || [];
  const creatorProfile = optimizedData?.creatorProfile || null;

  // Check if current user is registered
  const isRegistered = participants.some(p => p.user_id === user?.id);

  // Get creator rating (simplified - could be optimized further if needed)
  const [creatorRating, setCreatorRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchCreatorRating = async () => {
      if (gameData?.created_by) {
        try {
          const { data: ratingData } = await supabase
            .rpc('get_average_rating', { p_user_id: gameData.created_by });
          setCreatorRating(ratingData || 0);
        } catch (error) {
          console.error('Error fetching creator rating:', error);
          setCreatorRating(0);
        }
      }
    };

    fetchCreatorRating();
  }, [gameData?.created_by]);

  // Load user profile if needed
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user?.id && !userProfile) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            // Safely cast profile data and ensure all required properties exist
            const profileData: Profile = {
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
              team_logo: null, // This field doesn't exist in profiles table
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
            setUserProfile(profileData);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
    };

    loadUserProfile();
  }, [user?.id, userProfile]);

  const loadParticipants = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    gameData,
    participants,
    loading,
    isRegistered,
    creatorRating,
    creatorProfile,
    userProfile,
    loadParticipants
  };
};
