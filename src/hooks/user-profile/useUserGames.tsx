import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const DEFAULT_IMAGE = '/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png';

interface Game {
  id: string;
  title: string;
  date: string;
  address: string;
  city: string;
  zip_code: string;
  max_players?: number;
  price?: number;
  created_by: string;
}

interface GameParticipant {
  game_id: string;
  user_id: string;
  role: string;
  status: string;
}

interface FormattedGame {
  id: string;
  title: string;
  date: string;
  rawDate: string;
  location: string;
  address: string;
  zip_code: string;
  city: string;
  max_players: number;
  participantsCount: number;
  price: number;
  image: string;
  role: string;
  status: 'À venir' | 'Terminé';
  team: string;
  result: string;
}

export const useUserGames = (userId: string | undefined) => {
  const [userGames, setUserGames] = useState<FormattedGame[]>([]);

  const fetchUserGames = async () => {
    if (!userId) return;

    try {
      const [
        { data: gameParticipants, error: participantsError },
        { data: createdGames, error: createdGamesError }
      ] = await Promise.all([
        supabase.from('game_participants').select('*').eq('user_id', userId),
        supabase.from('airsoft_games').select('*').eq('created_by', userId)
      ]);

      if (participantsError || createdGamesError) {
        throw participantsError || createdGamesError;
      }

      let formattedGames: FormattedGame[] = [];
      let pastGamesCount = 0;

      // === Participated Games ===
      const participatedGameIds = gameParticipants?.map(p => p.game_id) ?? [];
      let participatedGames: Game[] = [];

      if (participatedGameIds.length > 0) {
        const { data: games, error: gamesError } = await supabase
          .from('airsoft_games')
          .select('*')
          .in('id', participatedGameIds);

        if (gamesError) throw gamesError;
        participatedGames = games ?? [];

        const { data: participantCounts, error: countsError } = await supabase
          .from('game_participants')
          .select('game_id, count:id', { count: 'exact' })
          .in('game_id', participatedGameIds)
          .group('game_id');

        if (countsError) throw countsError;

        const countMap = Object.fromEntries(
          (participantCounts ?? []).map(({ game_id, count }) => [game_id, count])
        );

        const formatted = gameParticipants
          .map(gp => {
            const game = participatedGames.find(g => g.id === gp.game_id);
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
              address: game.address,
              zip_code: game.zip_code,
              city: game.city,
              max_players: game.max_players ?? 0,
              participantsCount: countMap[game.id] ?? 0,
              price: game.price ?? 0,
              image: DEFAULT_IMAGE,
              role: gp.role,
              status: isUpcoming ? 'À venir' : 'Terminé',
              team: 'Indéfini',
              result: gp.status
            } as FormattedGame;
          })
          .filter(Boolean) as FormattedGame[];

        formattedGames.push(...formatted);
      }

      // === Created Games ===
      if (createdGames?.length) {
        const createdIds = createdGames.map(g => g.id);

        const { data: createdCounts, error: createdCountsError } = await supabase
          .from('game_participants')
          .select('game_id, count:id', { count: 'exact' })
          .in('game_id', createdIds)
          .group('game_id');

        if (createdCountsError) throw createdCountsError;

        const createdMap = Object.fromEntries(
          (createdCounts ?? []).map(({ game_id, count }) => [game_id, count])
        );

        const formatted = createdGames.map(game => {
          const gameDate = new Date(game.date);
          const isUpcoming = gameDate > new Date();

          return {
            id: game.id,
            title: game.title,
            date: gameDate.toLocaleDateString('fr-FR'),
            rawDate: game.date,
            location: game.city,
            address: game.address,
            zip_code: game.zip_code,
            city: game.city,
            max_players: game.max_players ?? 0,
            participantsCount: createdMap[game.id] ?? 0,
            price: game.price ?? 0,
            image: DEFAULT_IMAGE,
            role: 'Organisateur',
            status: isUpcoming ? 'À venir' : 'Terminé',
            team: 'Organisateur',
            result: 'Organisateur'
          } as FormattedGame;
        });

        formattedGames.push(...formatted);

        // Update organized count
        await supabase
          .from('user_stats')
          .update({ games_organized: createdGames.length })
          .eq('user_id', userId);
      }

      // Update games played
      await supabase
        .from('user_stats')
        .update({ games_played: pastGamesCount })
        .eq('user_id', userId);

      // Remove duplicates
      formattedGames = Array.from(new Map(formattedGames.map(g => [g.id, g])).values());

      // Sort: upcoming first, then by date descending
      formattedGames.sort((a, b) => {
        if (a.status === 'À venir' && b.status !== 'À venir') return -1;
        if (a.status !== 'À venir' && b.status === 'À venir') return 1;
        return new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime();
      });

      setUserGames(formattedGames);
    } catch (err) {
      console.error('Erreur lors de la récupération des parties :', err);
    }
  };

  return { userGames, fetchUserGames };
};
