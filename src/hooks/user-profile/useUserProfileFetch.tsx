
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { Profile } from '@/types/profile';
import { useQuery } from '@tanstack/react-query';

const fetchFullUserProfile = async (username: string | undefined): Promise<{ profile: Profile; stats: any } | null> => {
  if (!username) {
    console.log('useUserProfileFetch: No username provided');
    return null;
  }

  console.log('useUserProfileFetch: Fetching profile for username:', username);

  const { data: userProfile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (profileError) {
    console.error('useUserProfileFetch: Profile fetch error:', profileError);
    throw profileError;
  }
  
  if (!userProfile) {
    console.log('useUserProfileFetch: No profile found for username:', username);
    return null;
  }

  console.log('useUserProfileFetch: Profile found:', userProfile);

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

  // Fetch team logo if user has a team
  if (userProfile.team_id) {
    console.log('useUserProfileFetch: Fetching team data for team_id:', userProfile.team_id);
    const { data: teamData } = await supabase
      .from('teams')
      .select('logo')
      .eq('id', userProfile.team_id)
      .maybeSingle();
    
    if (teamData?.logo) {
      completeProfile.team_logo = teamData.logo;
    }
  }

  // Fetch user stats
  const { data: stats, error: statsError } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userProfile.id)
    .maybeSingle();

  if (statsError && statsError.code !== 'PGRST116') {
    console.error('useUserProfileFetch: Stats fetch error:', statsError);
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

  console.log('useUserProfileFetch: Returning complete profile data');
  return { profile: completeProfile, stats: stats || defaultStats };
};

/**
 * Hook for fetching basic user profile data by username, now using React Query
 */
export const useUserProfileFetch = (username: string | undefined) => {
  const navigate = useNavigate();
  const fetchTriggered = useRef(false);
  
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState<boolean>(false);
  
  useEffect(() => {
    if (fetchTriggered.current) return;
    
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
      fetchTriggered.current = true;
    };
    
    fetchCurrentUser();
  }, []);
  
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ['userProfileData', username],
    queryFn: () => fetchFullUserProfile(username),
    enabled: !!username,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Éviter les requêtes répétées
    refetchOnMount: false, // Éviter les requêtes répétées au montage
  });

  useEffect(() => {
    if (isSuccess && data === null && username) {
      console.log('useUserProfileFetch: User not found, showing toast and redirecting');
      toast({
        title: "Utilisateur non trouvé",
        description: "Ce profil n'existe pas",
        variant: "destructive",
      });
      navigate('/');
    }
    if (isError) {
      console.error('useUserProfileFetch: Error loading user profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de l'utilisateur",
        variant: "destructive",
      });
    }
  }, [isSuccess, isError, data, navigate, username, error]);
  
  const profileData = data?.profile ?? null;
  const userStats = data?.stats ?? null;
  const userData = profileData ? { id: profileData.id, ...profileData } : null;

  console.log('useUserProfileFetch: Final return data:', {
    loading: isLoading,
    userData,
    profileData,
    userStats,
    currentUserId,
    isCurrentUserAdmin,
  });

  return {
    loading: isLoading,
    userData,
    profileData,
    userStats,
    currentUserId,
    isCurrentUserAdmin,
  };
};
