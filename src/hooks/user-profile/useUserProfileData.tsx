import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { Profile } from '@/types/profile';

export const useUserProfileData = (username?: string) => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState<any>(null);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [userGames, setUserGames] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch current session user ID
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.id) {
        setCurrentUserId(data.session.user.id);
      }
    });
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!username) return setLoading(false);

    try {
      setLoading(true);

      // 1. Fetch profile
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (profileError || !userProfile) {
        toast({
          title: "Utilisateur non trouvé",
          description: "Ce profil n'existe pas",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      const profile: Profile = {
        ...userProfile,
        newsletter_subscribed: userProfile.newsletter_subscribed ?? null,
      };

      // 2. Fetch stats
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', profile.id)
        .maybeSingle();

      if (statsError && statsError.code !== 'PGRST116') throw statsError;

      // 3. Fetch equipment
      const { data: userEquipment, error: equipmentError } = await supabase
        .from('equipment')
        .select('*')
        .eq('user_id', profile.id);

      if (equipmentError) throw equipmentError;

      // 4. Fetch game participations
      const { data: participations, error: gamesError } = await supabase
        .from('game_participants')
        .select('*')
        .eq('user_id', profile.id);

      if (gamesError) throw gamesError;

      const gameIds = participations.map(gp => gp.game_id);
      const { data: participatedGames = [] } = gameIds.length
        ? await supabase.from('airsoft_games').select('*').in('id', gameIds)
        : { data: [] };

      const formattedParticipations = participations.map(part => {
        const game = participatedGames.find(g => g.id === part.game_id);
        if (!game) return null;
        return {
          id: game.id,
          title: game.title,
          date: new Date(game.date).toLocaleDateString('fr-FR'),
          location: game.city,
          image: '/lovable-uploads/default.png',
          role: part.role,
          status: new Date(game.date) > new Date() ? 'À venir' : 'Terminé',
          team: 'Indéfini',
          result: part.status,
        };
      }).filter(Boolean);

      // 5. Fetch created games
      const { data: createdGames, error: createdGamesError } = await supabase
        .from('airsoft_games')
        .select('*')
        .eq('created_by', profile.id);

      if (createdGamesError) throw createdGamesError;

      const formattedCreated = createdGames.map(game => ({
        id: game.id,
        title: game.title,
        date: new Date(game.date).toLocaleDateString('fr-FR'),
        location: game.city,
        image: '/lovable-uploads/default.png',
        role: 'Organisateur',
        status: new Date(game.date) > new Date() ? 'À venir' : 'Terminé',
        team: 'Organisateur',
        result: 'Organisateur',
      }));

      // 6. Update stats if needed
      if (createdGames.length > 0 && stats) {
        await supabase
          .from('user_stats')
          .update({ games_organized: createdGames.length })
          .eq('user_id', profile.id);
        stats.games_organized = createdGames.length;
      }

      // 7. Fetch badges
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
        .eq('user_id', profile.id);

      if (badgesError) throw badgesError;

      const formattedBadges = (badges || []).map(entry => ({
        id: entry.badges.id,
        name: entry.badges.name,
        description: entry.badges.description,
        icon: entry.badges.icon || '/placeholder.svg',
        date: new Date(entry.date).toLocaleDateString('fr-FR'),
        backgroundColor: entry.badges.background_color || '#f8f9fa',
        borderColor: entry.badges.border_color || '#e9ecef',
      }));

      // 8. Merge all game data
      const allGames = [...formattedParticipations, ...formattedCreated].filter(
        (g, i, arr) => arr.findIndex(x => x.id === g.id) === i
      );

      const enrichedProfile = {
        ...profile,
        games: allGames,
        allGames,
        badges: formattedBadges,
      };

      setUserData({ id: profile.id, ...enrichedProfile });
      setProfileData(enrichedProfile);
      setUserStats(stats || {
        user_id: profile.id,
        games_played: 0,
        games_organized: createdGames.length || 0,
        preferred_game_type: 'Indéfini',
        favorite_role: 'Indéfini',
        level: 'Débutant',
        reputation: profile.reputation || 0,
        win_rate: '0%',
        accuracy: '0%',
        time_played: '0h',
        objectives_completed: 0,
        flags_captured: 0,
        tactical_awareness: 'À évaluer',
      });
      setEquipment(userEquipment || []);
      setUserGames(allGames);
      setUserBadges(formattedBadges);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de l'utilisateur",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [username, navigate]);

  useEffect(() => {
    if (username) {
      fetchUserData();
    }
  }, [username, fetchUserData]);

  return {
    loading,
    userData,
    profileData,
    userStats,
    equipment,
    userGames,
    userBadges,
    currentUserId,
    updateLocation: async () => false,
    updateUserStats: async () => false,
    fetchProfileData: async () => true,
  };
};
