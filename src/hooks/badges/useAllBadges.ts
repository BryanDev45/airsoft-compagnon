
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  background_color: string;
  border_color: string;
  created_at: string;
}

const fetchAllBadges = async () => {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const useAllBadges = () => {
  return useQuery<Badge[], Error>({
    queryKey: ['allBadges'],
    queryFn: fetchAllBadges,
  });
};
