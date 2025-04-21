import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

export const useProfileData = (userId?: string) => {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const navigate = useNavigate();

  const fetchProfileData = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    try {
      // Charger le profil
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
        const user = userData?.user;
        
        if (user) {
          const meta = user.user_metadata;
          const newProfile = {
            id: userId,
            username: meta.username || `user_${userId.slice(0, 8)}`,
            email: user.email,
            firstname: meta.firstname,
            lastname: meta.lastname,
            birth_date: meta.birth_date,
            age: meta.age || null,
            join_date: new Date().toISOString().split('T')[0],
            avatar: meta.avatar
          };

          const { error: insertError } = await supabase
            .from('profiles')
            .insert(newProfile);

          if (insertError) throw insertError;

          setProfileData(newProfile);
        }
      } else {
        setProfileData(profile);
      }

      // Charger ou créer les stats
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (statsError && statsError.code !== 'PGRST116') {
        throw statsError;
      }

      if (!stats) {
        const defaultStats = {
          user_id: userId,
          games_played: 0,
          games_organized: 0,
          reputation: 0,
          preferred_game_type: 'CQB',
          favorite_role: 'Assaut',
          level: 'Débutant',
        };

        const { error: insertStatsError } = await supabase
          .from('user_stats')
          .insert(defaultStats);

        if (insertStatsError) throw insertStatsError;

        setUserStats(defaultStats);
      } else {
        setUserStats(stats);
      }

    } catch (error: any) {
      console.error("Erreur lors du chargement des données:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updateLocation = async (location: string) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ location })
        .eq('id', userId);

      if (error) throw error;

      setProfileData(prev => ({ ...prev, location }));

      toast({
        title: "Succès",
        description: "Votre localisation a été mise à jour avec succès",
      });

      return true;
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de la localisation:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la localisation",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateUserStats = async (
    preferredGameType: string,
    favoriteRole: string,
    level: string
  ) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('user_stats')
        .update({
          preferred_game_type: preferredGameType,
          favorite_role: favoriteRole,
          level: level,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      setUserStats(prev => ({
        ...prev,
        preferred_game_type: preferredGameType,
        favorite_role: favoriteRole,
        level: level,
        updated_at: new Date().toISOString()
      }));

      return true;
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour des stats:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos statistiques: " + error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    loading,
    profileData,
    userStats,
    fetchProfileData,
    updateLocation,
    updateUserStats,
  };
};
