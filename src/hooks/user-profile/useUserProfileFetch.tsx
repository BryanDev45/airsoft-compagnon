
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
          .maybeSingle();
        
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
          .maybeSingle();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw profileError;
        }
        
        if (!userProfile) {
          toast({
            title: "Utilisateur non trouvé",
            description: "Ce profil n'existe pas",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        // Create complete profile object
        const completeProfile: Profile = {
          id: userProfile.id,
          username: userProfile.username,
          email: userProfile.email,
          firstname: userProfile.firstname,
          lastname: userProfile.lastname,
          birth_date: userProfile.birth_date,
          age: userProfile.age,
          join_date: userProfile.join_date,
          avatar: userProfile.avatar,
          banner: userProfile.banner,
          bio: userProfile.bio,
          location: userProfile.location,
          phone_number: userProfile.phone_number,
          team: userProfile.team,
          team_id: userProfile.team_id,
          team_logo: null,
          is_team_leader: userProfile.is_team_leader,
          is_verified: userProfile.is_verified,
          newsletter_subscribed: userProfile.newsletter_subscribed ?? null,
          Admin: userProfile.Admin,
          Ban: userProfile.Ban,
          ban_date: userProfile.ban_date,
          ban_reason: userProfile.ban_reason,
          banned_by: userProfile.banned_by,
          reputation: userProfile.reputation,
          friends_list_public: userProfile.friends_list_public
        };

        // If user has a team, fetch team logo
        if (userProfile.team_id) {
          const { data: teamData } = await supabase
            .from('teams')
            .select('logo')
            .eq('id', userProfile.team_id)
            .maybeSingle();
          
          if (teamData?.logo) {
            completeProfile.team_logo = teamData.logo;
          }
        }

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
