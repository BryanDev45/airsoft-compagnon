
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { Profile } from '@/types/profile';

/**
 * Hook core pour récupérer les données de base d'un profil utilisateur
 */
export const useUserProfileCore = (username: string | undefined) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState<boolean>(false);
  const fetchTriggered = useRef(false);

  useEffect(() => {
    if (fetchTriggered.current || !username) return;
    
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // Récupérer l'utilisateur actuel une seule fois
        const { data } = await supabase.auth.getSession();
        if (data.session?.user?.id) {
          setCurrentUserId(data.session.user.id);
          
          const { data: currentUserProfile } = await supabase
            .from('profiles')
            .select('Admin')
            .eq('id', data.session.user.id)
            .maybeSingle();
          
          if (currentUserProfile) {
            setIsCurrentUserAdmin(currentUserProfile.Admin === true);
          }
        }

        // Récupérer le profil utilisateur
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

        // Créer le profil complet
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

        // Récupérer le logo de l'équipe si nécessaire
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

        setProfileData(completeProfile);
        
      } catch (error: any) {
        console.error("Error loading profile:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de l'utilisateur",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        fetchTriggered.current = true;
      }
    };

    fetchUserProfile();
  }, [username, navigate]);

  return {
    loading,
    profileData,
    currentUserId,
    isCurrentUserAdmin
  };
};
