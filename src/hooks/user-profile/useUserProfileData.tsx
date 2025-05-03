
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

/**
 * Hook for fetching user profile data
 */
export const useUserProfileData = (username: string | undefined) => {
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [userGames, setUserGames] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.id) {
        setCurrentUserId(data.session.user.id);
      }
    };
    
    fetchCurrentUser();
  }, []);
  
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

        const { data: stats, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', userProfile.id)
          .maybeSingle();

        if (statsError && statsError.code !== 'PGRST116') {
          throw statsError;
        }

        const { data: userEquipment, error: equipmentError } = await supabase
          .from('equipment')
          .select('*')
          .eq('user_id', userProfile.id);

        if (equipmentError) throw equipmentError;

        // 1. First, fetch games where the user is a participant
        const { data: gameParticipants, error: gamesError } = await supabase
          .from('game_participants')
          .select(`
            id,
            status,
            role,
            game_id,
            user_id
          `)
          .eq('user_id', userProfile.id);

        if (gamesError) throw gamesError;

        // 2. Fetch games created by the user
        const { data: createdGames, error: createdGamesError } = await supabase
          .from('airsoft_games')
          .select('*')
          .eq('created_by', userProfile.id);

        if (createdGamesError) throw createdGamesError;
        
        console.log("Created games:", createdGames);
        console.log("Game participants:", gameParticipants);

        let formattedGames: any[] = [];

        // 3. Format participated games
        if (gameParticipants && gameParticipants.length > 0) {
          // Fetch the actual game data for each participation
          const gameIds = gameParticipants.map(gp => gp.game_id);
          
          if (gameIds.length > 0) {
            const { data: games, error: gamesDataError } = await supabase
              .from('airsoft_games')
              .select('*')
              .in('id', gameIds);
              
            if (gamesDataError) throw gamesDataError;
            
            if (games && games.length > 0) {
              const participatedGames = gameParticipants.map(gp => {
                const gameData = games.find(g => g.id === gp.game_id);
                if (gameData) {
                  return {
                    id: gameData.id,
                    title: gameData.title,
                    date: new Date(gameData.date).toLocaleDateString('fr-FR'),
                    location: gameData.city,
                    image: '/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png',
                    role: gp.role,
                    status: new Date(gameData.date) > new Date() ? 'À venir' : 'Terminé',
                    team: 'Indéfini',
                    result: gp.status
                  };
                }
                return null;
              }).filter(Boolean);
              
              formattedGames = [...formattedGames, ...participatedGames];
            }
          }
        }

        // 4. Format created games
        if (createdGames && createdGames.length > 0) {
          const organizedGames = createdGames.map(game => ({
            id: game.id,
            title: game.title,
            date: new Date(game.date).toLocaleDateString('fr-FR'),
            location: game.city,
            image: '/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png',
            role: 'Organisateur',
            status: new Date(game.date) > new Date() ? 'À venir' : 'Terminé',
            team: 'Organisateur',
            result: 'Organisateur'
          }));
          
          formattedGames = [...formattedGames, ...organizedGames];
        }

        // 5. Make sure we update the user_stats with the correct count of created games
        if (createdGames && createdGames.length > 0 && stats) {
          const { error: updateError } = await supabase
            .from('user_stats')
            .update({ games_organized: createdGames.length })
            .eq('user_id', userProfile.id);
            
          if (updateError) {
            console.error("Error updating games_organized count:", updateError);
          } else {
            // Update local state for user stats
            stats.games_organized = createdGames.length;
          }
        }

        const { data: badges, error: badgesError } = await supabase
          .from('user_badges')
          .select(`
            date,
            badges (
              id,
              name,
              description,
              icon,
              background_color,
              border_color
            )
          `)
          .eq('user_id', userProfile.id);

        if (badgesError) throw badgesError;

        let formattedBadges = [];
        if (badges && badges.length > 0) {
          formattedBadges = badges.map(entry => ({
            id: entry.badges.id,
            name: entry.badges.name,
            description: entry.badges.description,
            icon: entry.badges.icon || '/placeholder.svg',
            date: new Date(entry.date).toLocaleDateString('fr-FR'),
            backgroundColor: entry.badges.background_color || '#f8f9fa',
            borderColor: entry.badges.border_color || '#e9ecef'
          }));
        }

        // Remove duplicates in case a game appears in both participated and created lists
        formattedGames = formattedGames.filter((game, index, self) => 
          index === self.findIndex(g => g.id === game.id)
        );

        console.log("Final formatted games:", formattedGames);

        const enrichedProfile = {
          ...userProfile,
          games: formattedGames,
          allGames: [...formattedGames],
          badges: formattedBadges
        };

        setUserData({ id: userProfile.id, ...enrichedProfile });
        setProfileData(enrichedProfile);
        setUserStats(stats || {
          user_id: userProfile.id,
          games_played: 0,
          games_organized: createdGames?.length || 0,
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
        setEquipment(userEquipment || []);
        setUserGames(formattedGames);
        setUserBadges(formattedBadges);
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

  // Placeholder functions for mock behaviors
  const updateLocation = async () => {
    console.log("updateLocation called, but not available in UserProfile view");
    return false;
  };

  const updateUserStats = async () => {
    console.log("updateUserStats called, but not available in UserProfile view");
    return false;
  };
  
  const fetchProfileData = async () => {
    console.log("Fetching profile data for user ID:", profileData?.id);
    return true;
  };

  return {
    loading,
    userData,
    profileData,
    userStats,
    equipment,
    userGames,
    userBadges,
    currentUserId,
    updateLocation,
    updateUserStats,
    fetchProfileData
  };
};
