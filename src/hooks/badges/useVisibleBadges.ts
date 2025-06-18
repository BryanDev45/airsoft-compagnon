
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from './useAllBadges';

const fetchVisibleBadges = async (userId?: string): Promise<Badge[]> => {
  if (!userId) {
    // Si l'utilisateur n'est pas connecté, retourner seulement les badges visibles
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .eq('is_hidden', false)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }
    return data as Badge[];
  }

  // Si l'utilisateur est connecté, récupérer tous les badges visibles + les badges cachés qu'il a débloqués
  const { data: visibleBadges, error: visibleError } = await supabase
    .from('badges')
    .select('*')
    .eq('is_hidden', false)
    .order('name', { ascending: true });

  if (visibleError) {
    throw new Error(visibleError.message);
  }

  // Récupérer les badges cachés que l'utilisateur a débloqués
  const { data: unlockedHiddenBadges, error: unlockedError } = await supabase
    .from('badges')
    .select(`
      *,
      user_badges!inner(user_id)
    `)
    .eq('is_hidden', true)
    .eq('user_badges.user_id', userId)
    .order('name', { ascending: true });

  if (unlockedError) {
    throw new Error(unlockedError.message);
  }

  // Combiner les deux listes et supprimer les doublons
  const allBadges = [...(visibleBadges as Badge[]), ...(unlockedHiddenBadges as Badge[])];
  const uniqueBadges = allBadges.filter((badge, index, self) => 
    index === self.findIndex(b => b.id === badge.id)
  );

  return uniqueBadges.sort((a, b) => a.name.localeCompare(b.name));
};

export const useVisibleBadges = () => {
  const { user } = useAuth();
  
  return useQuery<Badge[], Error>({
    queryKey: ['visibleBadges', user?.id],
    queryFn: () => fetchVisibleBadges(user?.id),
  });
};
