
import { useState } from 'react';
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

  // Define the fetchProfileData function
  const fetchProfileData = async (): Promise<void> => {
    if (!userId) {
      return;
    }
    
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
            team: null,
            team_id: null,
            is_team_leader: null,
            is_verified: null,
            newsletter_subscribed: null
          };
          
          // Insert the new profile
          const { error: insertError } = await supabase
            .from('profiles')
            .insert(newProfile);
            
          if (insertError) throw insertError;
          
          setProfileData(newProfile);
        }
      } else {
        setProfileData(profile as Profile);
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
  };

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
