
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

      const { data: teamsData, error } = await query.order('name');

      if (error) {
        console.error('Error searching teams:', error);
        throw error;
      }

      if (!teamsData) return [];

      // Get actual member counts for each team
      const teamIds = teamsData.map(team => team.id);
      
      const { data: memberCounts, error: memberError } = await supabase
        .from('team_members')
        .select('team_id')
        .in('team_id', teamIds)
        .eq('status', 'confirmed');

      if (memberError) {
        console.error('Error fetching member counts:', memberError);
        // Return teams with existing member_count if query fails
        return teamsData;
      }

      // Count members per team
      const memberCountMap: Record<string, number> = {};
      teamIds.forEach(id => memberCountMap[id] = 0);
      
      memberCounts?.forEach(member => {
        memberCountMap[member.team_id] = (memberCountMap[member.team_id] || 0) + 1;
      });

      // Return teams with updated member counts
      return teamsData.map(team => ({
        ...team,
        member_count: memberCountMap[team.id] || 0
      }));
    },
    // Always enable the query now, even with empty search
    enabled: true,
  });
};
