import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

export const useProfileData = (userId: string | null) => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const navigate = useNavigate();

  const fetchProfileData = async () => {
    if (!userId) return false;

    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Fetch user stats
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (statsError && statsError.code !== 'PGRST116') throw statsError;

      // Fetch games that user created
      const { data: createdGames, error: createdGamesError } = await supabase
        .from('airsoft_games')
        .select('*')
        .eq('created_by', userId);

      if (createdGamesError) throw createdGamesError;

      // Fetch games that user is participating in
      const { data: gameParticipations, error: participationError } = await supabase
        .from('game_participants')
        .select('id, status, role, game_id, user_id')
        .eq('user_id', userId);

      if (participationError) throw participationError;
      
      // Fetch the games details separately to avoid relationship issues
      let participatedGames = [];
      if (gameParticipations && gameParticipations.length > 0) {
        const gameIds = gameParticipations.map(p => p.game_id).filter(Boolean);
        
        if (gameIds.length > 0) {
          const { data: games, error: gamesError } = await supabase
            .from('airsoft_games')
            .select('*')
            .in('id', gameIds);
          
          if (gamesError) throw gamesError;
          
          // Match games with participations
          participatedGames = gameParticipations.map(p => {
            const gameDetails = games?.find(g => g.id === p.game_id);
            if (!gameDetails) return null;
            
            return {
              id: p.game_id,
              title: gameDetails.title,
              date: new Date(gameDetails.date).toLocaleDateString('fr-FR'),
              location: gameDetails.city,
              image: '/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png',
              role: p.role || 'Participant',
              status: gameDetails.date >= new Date().toISOString().split('T')[0] ? 'À venir' : 'Terminé',
              team: 'Indéfini',
              result: p.status
            };
          }).filter(Boolean);
        }
      }

      // Format games
      let formattedGames = [];

      // Format created games
      if (createdGames && createdGames.length > 0) {
        const organizedGames = createdGames.map(game => ({
          id: game.id,
          title: game.title,
          date: new Date(game.date).toLocaleDateString('fr-FR'),
          location: game.city,
          image: '/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png',
          role: 'Organisateur',
          status: game.date >= new Date().toISOString().split('T')[0] ? 'À venir' : 'Terminé',
          team: 'Organisateur'
        }));
        formattedGames = [...formattedGames, ...organizedGames];
      }

      // Add participated games to the formatted games list
      formattedGames = [...formattedGames, ...participatedGames];

      // Remove duplicates in case a game appears in both participated and created lists
      formattedGames = formattedGames.filter((game, index, self) => 
        index === self.findIndex(g => g.id === game.id)
      );

      // Create enriched profile with games
      const enrichedProfile = {
        ...profile,
        games: formattedGames.slice(0, 5), // Show only 5 recent games
        allGames: formattedGames // Store all games for showing in dialog
      };

      setProfileData(enrichedProfile);
      setUserStats(stats || {
        user_id: userId,
        games_played: 0,
        preferred_game_type: 'Indéfini',
        favorite_role: 'Indéfini',
        level: 'Débutant',
        reputation: profile?.reputation || 0,
        win_rate: '0%',
        accuracy: '0%',
        time_played: '0h',
        objectives_completed: 0,
        flags_captured: 0,
        tactical_awareness: 'À évaluer'
      });
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du profil",
        variant: "destructive",
      });
      setLoading(false);
      return false;
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
      toast({
        title: "Localisation mise à jour",
        description: "Votre localisation a été mise à jour avec succès",
      });
      return true;
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la localisation",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateUserStats = async (gameType: string, role: string, level: string) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('user_stats')
        .update({
          preferred_game_type: gameType,
          favorite_role: role,
          level: level
        })
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating user stats:', error);
      return false;
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfileData();
    } else {
      setLoading(false);
    }
  }, [userId]);

  return {
    loading,
    profileData,
    userStats,
    updateLocation,
    updateUserStats,
    fetchProfileData
  };
};
