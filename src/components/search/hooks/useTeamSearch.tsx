
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Team {
  id: string;
  name: string;
  description?: string;
  location?: string;
  member_count?: number;
  is_recruiting?: boolean;
  is_association?: boolean;
  logo?: string;
  leader_id?: string;
}

export const useTeamSearch = (searchQuery: string) => {
  return useQuery({
    queryKey: ['teams', searchQuery],
    queryFn: async (): Promise<Team[]> => {
      if (!searchQuery.trim()) {
        return [];
      }

      let query = supabase
        .from('teams')
        .select('*');

      // Search by name or location
      if (searchQuery.trim()) {
        query = query.or(`name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.order('name');

      if (error) {
        console.error('Error searching teams:', error);
        throw error;
      }

      return data || [];
    },
    enabled: searchQuery.trim().length > 0,
  });
};
