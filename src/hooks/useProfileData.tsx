
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

export const useProfileData = (userId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const navigate = useNavigate();

  // Define the fetchProfileData function that was missing
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
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (!profile) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          // Créer un nouveau profil basé sur les métadonnées de l'utilisateur
          const metaData = userData.user.user_metadata;
          const newProfile = {
            id: userId,
            username: metaData.username || `user_${userId.substring(0, 8)}`,
            email: userData.user.email,
            firstname: metaData.firstname,
            lastname: metaData.lastname,
            birth_date: metaData.birth_date,
            age: metaData.age || null,
            join_date: new Date().toISOString().split('T')[0],
            avatar: metaData.avatar
          };
          
          // Insérer le nouveau profil
          const { error: insertError } = await supabase
            .from('profiles')
            .insert(newProfile);
            
          if (insertError) throw insertError;
          
          setProfileData(newProfile);
        }
      } else {
        setProfileData(profile);
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
        // Créer des statistiques par défaut si elles n'existent pas
        const defaultStats = {
          user_id: userId,
          games_played: 0,
          games_organized: 0,
          reputation: 0,
          preferred_game_type: 'CQB',
          favorite_role: 'Assaut',
          level: 'Débutant'
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
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!userId) {
        if (isMounted) setLoading(false);
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
          if (userData?.user && isMounted) {
            // Créer un nouveau profil basé sur les métadonnées de l'utilisateur
            const metaData = userData.user.user_metadata;
            const newProfile = {
              id: userId,
              username: metaData.username || `user_${userId.substring(0, 8)}`,
              email: userData.user.email,
              firstname: metaData.firstname,
              lastname: metaData.lastname,
              birth_date: metaData.birth_date,
              age: metaData.age || null,
              join_date: new Date().toISOString().split('T')[0],
              avatar: metaData.avatar
            };
            
            // Insérer le nouveau profil
            const { error: insertError } = await supabase
              .from('profiles')
              .insert(newProfile);
              
            if (insertError) throw insertError;
            
            setProfileData(newProfile);
          }
        } else if (isMounted) {
          setProfileData(profile);
        }

        if (isMounted) {
          const { data: stats, error: statsError } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

          if (statsError && statsError.code !== 'PGRST116') {
            throw statsError;
          }

          if (!stats && isMounted) {
            // Créer des statistiques par défaut si elles n'existent pas
            const defaultStats = {
              user_id: userId,
              games_played: 0,
              games_organized: 0,
              reputation: 0,
              preferred_game_type: 'CQB',
              favorite_role: 'Assaut',
              level: 'Débutant'
            };
            
            const { error: insertStatsError } = await supabase
              .from('user_stats')
              .insert(defaultStats);
              
            if (insertStatsError) throw insertStatsError;
            
            setUserStats(defaultStats);
          } else if (isMounted) {
            setUserStats(stats);
          }
        }
      } catch (error: any) {
        console.error("Erreur lors du chargement des données:", error);
        if (isMounted) {
          toast({
            title: "Erreur",
            description: "Impossible de charger les données du profil",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
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

  const updateUserStats = async (preferredGameType: string, favoriteRole: string, level: string) => {
    if (!userId) return false;
    
    try {
      console.log("Mise à jour des statistiques:", preferredGameType, favoriteRole, level);
      
      // Mise à jour dans la base de données
      const { error } = await supabase
        .from('user_stats')
        .update({
          preferred_game_type: preferredGameType,
          favorite_role: favoriteRole,
          level: level,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error("Erreur Supabase:", error);
        throw error;
      }

      // Mise à jour du state
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
    updateLocation,
    updateUserStats,
    fetchProfileData,
  };
};
