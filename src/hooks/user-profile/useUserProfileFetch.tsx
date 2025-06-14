
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { Profile } from '@/types/profile';
import { useQuery } from '@tanstack/react-query';

const fetchFullUserProfile = async (username: string | undefined): Promise<{ profile: Profile; stats: any } | null> => {
  if (!username) {
    return null;
  }

  const { data: userProfile, error: profileError } = await supabase
    .from('profiles')
    .select('*, spoken_language')
    .eq('username', username)
    .maybeSingle();

  if (profileError) {
    console.error('Profile fetch error:', profileError);
    throw profileError;
  }
  
  if (!userProfile) {
    return null;
  }

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
    friends_list_public: userProfile.friends_list_public,
    spoken_language: userProfile.spoken_language
  };

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

  const defaultStats = {
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
  };

  return { profile: completeProfile, stats: stats || defaultStats };
};


/**
 * Hook for fetching basic user profile data by username, now using React Query
 */
export const useUserProfileFetch = (username: string | undefined) => {
  const navigate = useNavigate();
  
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.id) {
        setCurrentUserId(data.session.user.id);
        
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
  
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['userProfileData', username],
    queryFn: () => fetchFullUserProfile(username),
    enabled: !!username,
  });

  useEffect(() => {
    if (isSuccess && data === null) {
      toast({
        title: "Utilisateur non trouvé",
        description: "Ce profil n'existe pas",
        variant: "destructive",
      });
      navigate('/');
    }
    if (isError) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de l'utilisateur",
        variant: "destructive",
      });
    }
  }, [isSuccess, isError, data, navigate]);
  
  const profileData = data?.profile ?? null;
  const userStats = data?.stats ?? null;
  const userData = profileData ? { id: profileData.id, ...profileData } : null;

  return {
    loading: isLoading,
    userData,
    profileData,
    userStats,
    currentUserId,
    isCurrentUserAdmin,
  };
};
