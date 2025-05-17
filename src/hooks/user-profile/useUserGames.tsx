
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

        // Fetch participant counts individually for each game
        const participantCounts: Record<string, number> = {};
        
        // Get counts for all games at once
        for (const gameId of participatedGameIds) {
          const { count, error: countError } = await supabase
            .from('game_participants')
            .select('*', { count: 'exact', head: true })
            .eq('game_id', gameId);
            
          if (!countError && count !== null) {
            participantCounts[gameId] = count;
          } else {
            participantCounts[gameId] = 0;
          }
        }

        const formatted = gameParticipants
          ?.map(gp => {
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
              participantsCount: participantCounts[game.id] ?? 0,
              price: game.price ?? 0,
              image: DEFAULT_IMAGE,
              role: gp.role,
              status: isUpcoming ? 'À venir' : 'Terminé',
              team: 'Indéfini',
              result: gp.status
            } as FormattedGame;
          })
          .filter(Boolean) as FormattedGame[];

        formattedGames.push(...(formatted || []));
      }

      // === Created Games ===
      if (createdGames?.length) {
        const createdIds = createdGames.map(g => g.id);
        
        // Fetch participant counts individually for created games
        const createdCounts: Record<string, number> = {};
        
        for (const gameId of createdIds) {
          const { count, error: countError } = await supabase
            .from('game_participants')
            .select('*', { count: 'exact', head: true })
            .eq('game_id', gameId);
            
          if (!countError && count !== null) {
            createdCounts[gameId] = count;
          } else {
            createdCounts[gameId] = 0;
          }
        }

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
            participantsCount: createdCounts[game.id] ?? 0,
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
