
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GameData } from '@/types/game';

export const useGameEditData = (gameId: string | undefined) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [canEdit, setCanEdit] = useState(false);

  // Check if user is admin
  const isUserAdmin = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('is_current_user_admin');
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      return data || false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  // Fetch game data
  useEffect(() => {
    const fetchGameData = async () => {
      if (!gameId) return;

      try {
        // Get game data
        const { data: game, error: gameError } = await supabase
          .from('airsoft_games')
          .select('*')
          .eq('id', gameId)
          .single();

        if (gameError) {
          toast({
            title: "Erreur",
            description: "Impossible de charger les données de la partie",
            variant: "destructive"
          });
          navigate('/parties');
          return;
        }

        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast({
            title: "Non autorisé",
            description: "Vous devez être connecté pour modifier une partie",
            variant: "destructive"
          });
          navigate(`/game/${gameId}`);
          return;
        }

        const isCreator = session.user.id === game.created_by;
        const userIsAdmin = await isUserAdmin();
        
        // Check if game date has passed
        const gameDate = new Date(game.date);
        const today = new Date();
        const isPastGame = gameDate < today;

        // Allow editing if user is creator OR admin, but not for past games
        if ((!isCreator && !userIsAdmin) || isPastGame) {
          toast({
            title: "Non autorisé",
            description: isPastGame ? 
              "Impossible de modifier une partie passée" : 
              "Vous n'êtes pas autorisé à modifier cette partie",
            variant: "destructive"
          });
          navigate(`/game/${gameId}`);
          return;
        }

        setCanEdit(true);
        setGameData(game);

      } catch (error) {
        console.error("Error fetching game data:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement des données",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [gameId, navigate]);

  return {
    loading,
    gameData,
    canEdit,
    isUserAdmin
  };
};
