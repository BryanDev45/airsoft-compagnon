
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
      // Vérifier si le profil existe déjà
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Si le profil n'existe pas encore, récupérer les données de l'utilisateur Auth
      if (!profile) {
        console.log("Profil non trouvé, tentative de création...");
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
        // PGRST116 est le code pour "aucun résultat trouvé"
        throw statsError;
      }

      if (!stats) {
        // Créer des statistiques par défaut si elles n'existent pas
        const defaultStats = {
          user_id: userId,
          games_played: 0,
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

  const updateLocation = async (location: string) => {
    if (!userId) return false;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ location })
        .eq('id', userId);

      if (error) throw error;

      // Mettre à jour les données locales
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

      if (error) throw error;

      // Mettre à jour les données locales
      setUserStats(prev => ({
        ...prev,
        preferred_game_type: preferredGameType,
        favorite_role: favoriteRole,
        level: level,
        updated_at: new Date().toISOString()
      }));
      
      toast({
        title: "Succès",
        description: "Vos statistiques ont été mises à jour avec succès",
      });
      
      return true;
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour des stats:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos statistiques",
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
