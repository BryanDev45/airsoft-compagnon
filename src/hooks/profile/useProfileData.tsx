
import { useState, useEffect, useCallback, useRef } from 'react';
import { useProfileFetch } from './useProfileFetch';
import { useProfileUpdates } from './useProfileUpdates';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { Profile, UserStats } from '@/types/profile';

export const useProfileData = (userId: string | undefined) => {
  // Use the separated hooks
  const { 
    loading, 
    profileData, 
    userStats, 
    setProfileData, 
    setUserStats 
  } = useProfileFetch(userId);
  
  const { 
    updating, 
    updateLocation, 
    updateUserStats,
    updateNewsletterSubscription
  } = useProfileUpdates(userId, setProfileData, setUserStats);

  // Create stable reference to prevent infinite loops
  const fetchTriggeredRef = useRef(false);
  const userIdRef = useRef<string | undefined>();

  // Define the fetchProfileData function as a stable callback
  const fetchProfileData = useCallback(async (): Promise<void> => {
    if (!userId || fetchTriggeredRef.current) {
      return;
    }
    
    // Mark as triggered to prevent multiple calls
    fetchTriggeredRef.current = true;
    
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (!profile) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          // Create a new profile based on user metadata
          const metaData = userData.user.user_metadata;
          const newProfile: Profile = {
            id: userId,
            username: metaData.username || `user_${userId.substring(0, 8)}`,
            email: userData.user.email,
            firstname: metaData.firstname,
            lastname: metaData.lastname,
            birth_date: metaData.birth_date,
            age: metaData.age || null,
            join_date: new Date().toISOString().split('T')[0],
            avatar: metaData.avatar,
            banner: null,
            bio: null,
            location: null,
            phone_number: null,
            team: null,
            team_id: null,
            team_logo: null,
            is_team_leader: null,
            is_verified: null,
            newsletter_subscribed: false,
            Admin: null,
            Ban: null,
            ban_date: null,
            ban_reason: null,
            banned_by: null,
            reputation: null,
            friends_list_public: null,
            spoken_language: null
          };
          
          // Insert the new profile
          const { error: insertError } = await supabase
            .from('profiles')
            .insert(newProfile);
            
          if (insertError) throw insertError;
          
          setProfileData(newProfile);
        }
      } else {
        // Create a complete profile object including the newsletter_subscribed property
        const completeProfile: Profile = {
          ...(profile as any),
          newsletter_subscribed: profile.newsletter_subscribed ?? false
        };
        
        setProfileData(completeProfile);
      }

      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (statsError && statsError.code !== 'PGRST116') {
        throw statsError;
      }

      if (!stats) {
        // Create default statistics if they don't exist
        const defaultStats: UserStats = {
          user_id: userId,
          games_played: 0,
          games_organized: 0,
          reputation: 0,
          preferred_game_type: 'CQB',
          favorite_role: 'Assaut',
          level: 'Débutant',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { error: insertStatsError } = await supabase
          .from('user_stats')
          .insert(defaultStats);
          
        if (insertStatsError) throw insertStatsError;
        
        setUserStats(defaultStats);
      } else {
        setUserStats(stats as UserStats);
      }
    } catch (error: any) {
      console.error("Error loading data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du profil",
        variant: "destructive",
      });
    }
  }, [userId, setProfileData, setUserStats]);

  // Reset fetch trigger when userId changes
  useEffect(() => {
    if (userIdRef.current !== userId) {
      userIdRef.current = userId;
      fetchTriggeredRef.current = false;
    }
  }, [userId]);

  // Load profile data when userId changes (only once)
  useEffect(() => {
    if (userId && !fetchTriggeredRef.current) {
      fetchProfileData();
    }
  }, [userId, fetchProfileData]);

  return {
    loading,
    profileData,
    userStats,
    updateLocation,
    updateUserStats,
    updateNewsletterSubscription,
    fetchProfileData,
  };
};
