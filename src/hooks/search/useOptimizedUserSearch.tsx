
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
      const { data, error } = await supabase.rpc('search_users_optimized', {
        p_query: searchQuery,
        p_limit: 20,
        p_is_admin: isAdmin
      });

      if (error) {
        console.error('Error in optimized user search:', error);
        // Fallback to direct query if RPC fails
        console.log('Falling back to direct query...');
        
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
            team_id,
            teams(
              id,
              name,
              logo
            )
          `)
          .limit(20);
        
        // Filtrer les utilisateurs bannis sauf pour les admins
        if (!isAdmin) {
          queryBuilder = queryBuilder.eq('Ban', false);
        }
        
        // Ajouter le filtre de recherche
        if (searchQuery && searchQuery.length > 0) {
          queryBuilder = queryBuilder.or(`username.ilike.%${searchQuery}%,firstname.ilike.%${searchQuery}%,lastname.ilike.%${searchQuery}%`);
        }
        
        const { data: fallbackData, error: fallbackError } = await queryBuilder;
        
        if (fallbackError) {
          console.error('Error in fallback user search:', fallbackError);
          return [];
        }

        console.log('Fallback search returned:', fallbackData?.length || 0, 'users');

        // Transform fallback data to match expected interface
        return (fallbackData || []).map(user => ({
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
          team_name: user.teams?.name || null,
          team_logo: user.teams?.logo || null,
          team_info: user.teams ? {
            id: user.teams.id,
            name: user.teams.name,
            logo: user.teams.logo
          } : null
        }));
      }

      console.log('RPC search returned:', data?.length || 0, 'users');

      // Transform to match the expected interface
      return (data as OptimizedUserResult[]).map(user => ({
        ...user,
        Ban: user.ban,
        team_id: user.team_info?.id || null,
        team_name: user.team_info?.name || null,
        team_logo: user.team_info?.logo || null
      }));
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
    enabled: !!user, // Only run when user is logged in
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
  });

  return {
    users,
    isLoading,
    refetch
  };
};
