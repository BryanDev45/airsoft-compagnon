
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Profile, UserStats } from '@/types/profile';

/**
 * Hook core pour les données de profil de base
 */
export const useProfileCore = (userId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<Profile | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*, spoken_language')
          .eq('id', userId)
          .maybeSingle();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw profileError;
        }

        if (!profile) {
          // Créer un profil de base si inexistant
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            const metaData = userData.user.user_metadata;
            const newProfile: Profile = {
              id: userId,
              username: metaData.username || `user_${userId.substring(0, 8)}`,
              email: userData.user.email,
              firstname: metaData.firstname || null,
              lastname: metaData.lastname || null,
              birth_date: metaData.birth_date || null,
              age: metaData.age || null,
              join_date: new Date().toISOString().split('T')[0],
              avatar: metaData.avatar || null,
              banner: null,
              bio: null,
              location: null,
              phone_number: null,
              team: null,
              team_id: null,
              team_logo: null,
              is_team_leader: null,
              is_verified: null,
              newsletter_subscribed: null,
              Admin: null,
              Ban: null,
              ban_date: null,
              ban_reason: null,
              banned_by: null,
              reputation: null,
              friends_list_public: null,
              spoken_language: null
            };
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert(newProfile);
              
            if (!insertError) {
              setProfileData(newProfile);
            }
          }
        } else {
          // Profil complet avec logo d'équipe si nécessaire
          const completeProfile: Profile = {
            id: profile.id,
            username: profile.username,
            email: profile.email,
            firstname: profile.firstname,
            lastname: profile.lastname,
            birth_date: profile.birth_date,
            age: profile.age,
            join_date: profile.join_date,
            avatar: profile.avatar,
            banner: profile.banner,
            bio: profile.bio,
            location: profile.location,
            phone_number: profile.phone_number,
            team: profile.team,
            team_id: profile.team_id,
            team_logo: null,
            is_team_leader: profile.is_team_leader,
            is_verified: profile.is_verified,
            newsletter_subscribed: profile.newsletter_subscribed,
            Admin: profile.Admin,
            Ban: profile.Ban,
            ban_date: profile.ban_date,
            ban_reason: profile.ban_reason,
            banned_by: profile.banned_by,
            reputation: profile.reputation,
            friends_list_public: profile.friends_list_public,
            spoken_language: profile.spoken_language
          };
          
          // Récupérer le logo de l'équipe
          if (profile.team_id) {
            const { data: teamData } = await supabase
              .from('teams')
              .select('logo')
              .eq('id', profile.team_id)
              .maybeSingle();
            
            if (teamData?.logo) {
              completeProfile.team_logo = teamData.logo;
            }
          }
          
          setProfileData(completeProfile);
        }
      } catch (error: any) {
        console.error("Error loading profile data:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du profil",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  return {
    loading,
    profileData,
    setProfileData
  };
};
