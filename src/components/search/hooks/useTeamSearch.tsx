
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
      let query = supabase
        .from('teams')
        .select('*');

      // If there's a search query, filter by name or location
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
    // Always enable the query now, even with empty search
    enabled: true,
  });
};
