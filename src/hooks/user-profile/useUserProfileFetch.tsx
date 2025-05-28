
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { Profile } from '@/types/profile';

/**
 * Hook for fetching basic user profile data by username
 */
export const useUserProfileFetch = (username: string | undefined) => {
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState<boolean>(false);
  
  // Fetch current user session
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.id) {
        setCurrentUserId(data.session.user.id);
        
        // Check if the current user is an admin
        const { data: currentUserProfile, error } = await supabase
          .from('profiles')
          .select('Admin')
          .eq('id', data.session.user.id)
          .single();
        
        if (!error && currentUserProfile) {
          setIsCurrentUserAdmin(currentUserProfile.Admin === true);
        }
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  // Fetch user profile data by username
  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) {
        setLoading(false);
        return;
      }

      try {
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (profileError) throw profileError;
        
        if (!userProfile) {
          toast({
            title: "Utilisateur non trouvé",
            description: "Ce profil n'existe pas",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        // Ensure the profile has the newsletter_subscribed property
        const completeProfile: Profile = {
          ...(userProfile as any),
          newsletter_subscribed: userProfile.newsletter_subscribed ?? null
        };

        const { data: stats, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', userProfile.id)
          .maybeSingle();

        if (statsError && statsError.code !== 'PGRST116') {
          throw statsError;
        }

        setUserData({ id: completeProfile.id, ...completeProfile });
        setProfileData(completeProfile);
        setUserStats(stats || {
          user_id: userProfile.id,
          games_played: 0,
          games_organized: 0,
          preferred_game_type: 'Indéfini',
          favorite_role: 'Indéfini',
          level: 'Débutant',
          reputation: userProfile.reputation || 0,
          win_rate: '0%',
          accuracy: '0%',
          time_played: '0h',
          objectives_completed: 0,
          flags_captured: 0,
          tactical_awareness: 'À évaluer'
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de l'utilisateur",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    if (username && currentUserId !== null) {
      fetchUserData();
    } else if (username) {
      fetchUserData();
    }
  }, [username, navigate, currentUserId]);

  return {
    loading,
    userData,
    profileData,
    userStats,
    currentUserId,
    isCurrentUserAdmin,
    setUserData,
    setProfileData,
    setUserStats
  };
};
