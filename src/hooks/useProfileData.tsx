
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

export const useProfileData = (userId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchProfileData();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchProfileData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        // PGRST116 est le code pour "aucun résultat trouvé"
        throw statsError;
      }

      setProfileData(profile);
      setUserStats(stats || {
        user_id: userId,
        games_played: 0,
        preferred_game_type: 'CQB',
        favorite_role: 'Assaut',
      });
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
  };

  const updateLocation = async (location: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .rpc('update_user_location', {
          p_user_id: userId,
          p_location: location,
        });

      if (error) throw error;

      await fetchProfileData();
      toast({
        title: "Succès",
        description: "Localisation mise à jour",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la localisation",
        variant: "destructive",
      });
    }
  };

  const updateUserStats = async (preferredGameType: string, favoriteRole: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .rpc('update_user_stats', {
          p_user_id: userId,
          p_preferred_game_type: preferredGameType,
          p_favorite_role: favoriteRole,
        });

      if (error) throw error;

      await fetchProfileData();
      toast({
        title: "Succès",
        description: "Préférences mises à jour",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les préférences",
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
  };
};
