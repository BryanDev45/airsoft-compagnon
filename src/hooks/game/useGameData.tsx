
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
            // Ensure all required Profile properties are present
            setUserProfile({
              ...profile,
              team_logo: profile.team_logo || null,
              newsletter_subscribed: profile.newsletter_subscribed ?? null
            } as Profile);
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
