
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

  const {
    data: users = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['optimized-user-search', searchQuery, isAdmin],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('search_users_optimized', {
        p_query: searchQuery,
        p_limit: 20,
        p_is_admin: isAdmin
      });

      if (error) {
        console.error('Error in optimized user search:', error);
        return [];
      }

      // Transform to match the expected interface
      return (data as OptimizedUserResult[]).map(user => ({
        ...user,
        Ban: user.ban,
        team_id: user.team_info?.id || null,
        team_name: user.team_info?.name || null,
        team_logo: user.team_info?.logo || null
      }));
    },
    enabled: searchQuery.length >= 0 && !!user,
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
  });

  return {
    users,
    isLoading,
    refetch
  };
};
