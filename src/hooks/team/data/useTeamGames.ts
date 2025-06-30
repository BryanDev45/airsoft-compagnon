
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTeamGames = () => {
  const fetchTeamGames = useCallback(async (memberUserIds: string[]) => {
    let upcomingGames = [];
    let pastGames = [];

    if (memberUserIds.length > 0) {
      try {
        const { data: teamGames, error: gamesError } = await supabase
          .from('airsoft_games')
          .select('*')
          .in('created_by', memberUserIds)
          .order('date', { ascending: true });

        if (!gamesError && teamGames) {
          // Fetch creator usernames in a separate query
          const creatorIds = teamGames.map(game => game.created_by).filter(Boolean);
          const { data: creatorProfiles } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', creatorIds);
          
          // Attach creator info to games
          const gamesData = teamGames.map(game => {
            const creator = creatorProfiles?.find(profile => profile.id === game.created_by);
            return {
              ...game,
              creator: creator ? { username: creator.username } : null
            };
          });

          // Split games into upcoming and past
          const now = new Date();
          upcomingGames = (gamesData || [])
            .filter(game => new Date(game.date) > now)
            .map(game => ({
              id: game.id,
              title: game.title,
              date: new Date(game.date).toLocaleDateString('fr-FR'),
              location: game.city,
              participants: game.max_players || 0,
              creator: game.creator
            }));

          pastGames = (gamesData || [])
            .filter(game => new Date(game.date) <= now)
            .map(game => ({
              id: game.id,
              title: game.title,
              date: new Date(game.date).toLocaleDateString('fr-FR'),
              location: game.city,
              result: "Terminé", // Default status
              participants: game.max_players || 0,
              creator: game.creator
            }));
        }
      } catch (gameError) {
        console.error("Erreur lors de la récupération des parties:", gameError);
        // Don't fail the whole team loading just because games failed
      }
    }

    return { upcomingGames, pastGames };
  }, []);

  return { fetchTeamGames };
};
