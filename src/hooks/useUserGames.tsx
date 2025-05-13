import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserGames = (userId: string | undefined) => {
  const [userGames, setUserGames] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserGames = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // 1. Fetch games where the user is a participant
      const { data: gameParticipants, error: participantsError } = await supabase
        .from('game_participants')
        .select('*, game_id')
        .eq('user_id', userId);
        
      if (participantsError) throw participantsError;
      
      // 2. Fetch games created by the user
      const { data: createdGames, error: createdGamesError } = await supabase
        .from('airsoft_games')
        .select('*')
        .eq('created_by', userId);
        
      if (createdGamesError) throw createdGamesError;
      
      console.log("Created games:", createdGames);
      console.log("Participated games:", gameParticipants);
      
      let formattedGames: any[] = [];
      
      // 3. Format participated games
      if (gameParticipants && gameParticipants.length > 0) {
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
                const gameDate = new Date(gameData.date);
                const isUpcoming = gameDate > new Date();
                
                return {
                  id: gameData.id,
                  title: gameData.title,
                  date: new Date(gameData.date).toLocaleDateString('fr-FR'),
                  rawDate: gameData.date, // Ajout de la date brute pour le tri
                  location: gameData.city,
                  image: '/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png',
                  role: gp.role,
                  status: isUpcoming ? 'À venir' : 'Terminé',
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
        const organizedGames = createdGames.map(game => {
          const gameDate = new Date(game.date);
          const isUpcoming = gameDate > new Date();
          
          return {
            id: game.id,
            title: game.title,
            date: new Date(game.date).toLocaleDateString('fr-FR'),
            rawDate: game.date, // Ajout de la date brute pour le tri
            location: game.city,
            image: '/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png',
            role: 'Organisateur',
            status: isUpcoming ? 'À venir' : 'Terminé',
            team: 'Organisateur',
            result: 'Organisateur'
          };
        });
        
        formattedGames = [...formattedGames, ...organizedGames];
      }
      
      // 5. Update the games_organized count in user_stats if needed
      if (createdGames && createdGames.length > 0) {
        const { error: updateError } = await supabase
          .from('user_stats')
          .update({ games_organized: createdGames.length })
          .eq('user_id', userId);
          
        if (updateError) {
          console.error("Error updating games_organized count:", updateError);
        } else {
          console.log("Updated games_organized count to:", createdGames.length);
        }
      }
      
      // Remove duplicates
      formattedGames = formattedGames.filter((game, index, self) => 
        index === self.findIndex(g => g.id === game.id)
      );
      
      // Sort games: upcoming first, then by date (newest first for each category)
      formattedGames.sort((a, b) => {
        // Upcoming games first
        if (a.status === 'À venir' && b.status !== 'À venir') return -1;
        if (a.status !== 'À venir' && b.status === 'À venir') return 1;
        
        // For games with the same status, sort by date
        return new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime();
      });
      
      console.log("Final formatted games:", formattedGames);
      setUserGames(formattedGames);
      
    } catch (error) {
      console.error("Erreur lors de la récupération des parties:", error);
      setError(error as Error);
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
