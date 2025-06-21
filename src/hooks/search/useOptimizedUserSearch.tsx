
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

interface OptimizedUserResult {
  id: string;
  username: string;
  firstname: string | null;
  lastname: string | null;
  avatar: string | null;
  location: string | null;
  reputation: number | null;
  ban: boolean;
  is_verified: boolean | null;
  team_info: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
}

export const useOptimizedUserSearch = (searchQuery: string) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status once and cache it
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('Admin')
          .eq('id', user.id)
          .single();
        
        setIsAdmin(profileData?.Admin === true);
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  const queryFn = async () => {
    console.log('useOptimizedUserSearch: Starting search with query:', searchQuery);
    
    try {
      // First, get the users with basic profile information
      let queryBuilder = supabase
        .from('profiles')
        .select(`
          id, 
          username, 
          firstname, 
          lastname, 
          avatar, 
          location, 
          reputation, 
          Ban,
          is_verified,
          team_id
        `);
      
      // Filter banned users unless admin
      if (!isAdmin) {
        queryBuilder = queryBuilder.eq('Ban', false);
      }
      
      // Add search filter if we have a query
      if (searchQuery && searchQuery.trim().length > 0) {
        queryBuilder = queryBuilder.or(`username.ilike.%${searchQuery}%,firstname.ilike.%${searchQuery}%,lastname.ilike.%${searchQuery}%`);
      }
      
      queryBuilder = queryBuilder.limit(20).order('reputation', { ascending: false, nullsFirst: false });
      
      const { data: userData, error } = await queryBuilder;
      
      if (error) {
        console.error('Error in user search:', error);
        return [];
      }

      console.log('User search returned:', userData?.length || 0, 'users');

      if (!userData || userData.length === 0) {
        return [];
      }

      // Get unique team IDs from users who have teams
      const teamIds = [...new Set(userData.map(user => user.team_id).filter(Boolean))];
      
      // Fetch team information if there are any teams to fetch
      let teamsData: any[] = [];
      if (teamIds.length > 0) {
        const { data: teams, error: teamsError } = await supabase
          .from('teams')
          .select('id, name, logo')
          .in('id', teamIds);
        
        if (!teamsError && teams) {
          teamsData = teams;
        }
      }

      // Create a map for quick team lookup
      const teamsMap = new Map(teamsData.map(team => [team.id, team]));

      // Transform data to match expected interface
      return userData.map(user => {
        const teamData = user.team_id ? teamsMap.get(user.team_id) : null;
        
        return {
          id: user.id,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          avatar: user.avatar,
          location: user.location,
          reputation: user.reputation,
          Ban: user.Ban,
          ban: user.Ban, // Add both for compatibility
          is_verified: user.is_verified,
          team_id: user.team_id,
          team_name: teamData?.name || null,
          team_logo: teamData?.logo || null,
          team_info: teamData ? {
            id: teamData.id,
            name: teamData.name,
            logo: teamData.logo
          } : null
        };
      });
    } catch (error) {
      console.error('Unexpected error in user search:', error);
      return [];
    }
  };

  const {
    data: users = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['optimized-user-search', searchQuery, isAdmin],
    queryFn,
    enabled: true, // Always enable the query
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
  });

  return {
    users,
    isLoading,
    refetch
  };
};
