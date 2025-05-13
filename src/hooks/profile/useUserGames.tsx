import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserGames = (userId: string | undefined) => {
  const [userGames, setUserGames] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserGames = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Parties auxquelles l'utilisateur a participé
      const { data: gameParticipants, error: participantsError } = await supabase
        .from('game_participants')
        .select('*, game_id')
        .eq('user_id', userId);

      if (participantsError) throw participantsError;

      // 2. Parties organisées par l'utilisateur
      const { data: createdGames, error: createdGamesError } = await supabase
        .from('airsoft_games')
        .select('*')
        .eq('created_by', userId);

      if (createdGamesError) throw createdGamesError;

      let formattedGames: any[] = [];
      let pastGamesCount = 0;

      // 3. Format des parties jouées
      if (gameParticipants?.length > 0) {
        const gameIds = gameParticipants.map(gp => gp.game_id);
        const { data: games, error: gamesDataError } = await supabase
          .from('airsoft_games')
          .select('*')
          .in('id', gameIds);

        if (gamesDataError) throw gamesDataError;

        const participatedGames = gameParticipants.map(gp => {
          const game = games?.find(g => g.id === gp.game_id);
          if (!game) return null;

          const gameDate = new Date(game.date);
          const isUpcoming = gameDate > new Date();
          if (!isUpcoming) pastGamesCount++;

          return {
            id: game.id,
            title: game.title,
            date: gameDate.toLocaleDateString('fr-FR'),
            rawDate: game.date,
            location: game.city,
            image: '/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png',
            role: gp.role,
            status: isUpcoming ? 'À venir' : 'Terminé',
            team: 'Indéfini',
            result: gp.status
          };
        }).filter(Boolean);

        formattedGames.push(...participatedGames);
      }

      // 4. Format des parties organisées
      if (createdGames?.length > 0) {
        const organizedGames = createdGames.map(game => {
          const gameDate = new Date(game.date);
          const isUpcoming = gameDate > new Date();

          return {
            id: game.id,
            title: game.title,
            date: gameDate.toLocaleDateString('fr-FR'),
            rawDate: game.date,
            location: game.city,
            image: '/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png',
            role: 'Organisateur',
            status: isUpcoming ? 'À venir' : 'Terminé',
            team: 'Organisateur',
            result: 'Organisateur'
          };
        });

        formattedGames.push(...organizedGames);
      }

      // 5. Mise à jour des stats utilisateur
      if (createdGames?.length > 0) {
        const { error: updateOrganizedError } = await supabase
          .from('user_stats')
          .update({ games_organized: createdGames.length })
          .eq('user_id', userId);

        if (updateOrganizedError) console.error("Erreur maj games_organized:", updateOrganizedError);
      }

      const { error: updatePlayedError } = await supabase
        .from('user_stats')
        .update({ games_played: pastGamesCount })
        .eq('user_id', userId);

      if (updatePlayedError) console.error("Erreur maj games_played:", updatePlayedError);

      // 6. Dé-duplication & tri
      const uniqueGames = formattedGames.filter(
        (game, index, self) => index === self.findIndex(g => g.id === game.id)
      );

      uniqueGames.sort((a, b) => {
        if (a.status === 'À venir' && b.status !== 'À venir') return -1;
        if (a.status !== 'À venir' && b.status === 'À venir') return 1;
        return new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime();
      });

      setUserGames(uniqueGames);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des parties:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    userGames,
    fetchUserGames,
    loading,
    error
  };
};
