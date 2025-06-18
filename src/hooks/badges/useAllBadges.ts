
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  locked_icon: string | null;
  background_color: string;
  border_color: string;
  is_hidden: boolean | null;
  created_at: string;
}

const fetchAllBadges = async (): Promise<Badge[]> => {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data as Badge[];
};

export const useAllBadges = () => {
  return useQuery<Badge[], Error>({
    queryKey: ['allBadges'],
    queryFn: fetchAllBadges,
  });
};
