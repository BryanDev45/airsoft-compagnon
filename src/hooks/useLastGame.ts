
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useLastGame = () => {
  const [lastGame, setLastGame] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const { user } = useAuth();

  const fetchLastGame = async () => {
    if (!user || hasChecked) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('airsoft_games')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors de la récupération de la dernière partie:', error);
        return;
      }

      setLastGame(data);
      setHasChecked(true);
    } catch (error) {
      console.error('Erreur lors de la récupération de la dernière partie:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && !hasChecked) {
      fetchLastGame();
    }
  }, [user, hasChecked]);

  return { lastGame, isLoading, fetchLastGame };
};
