
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserResult {
  id: string;
  username: string;
  firstname: string | null;
  lastname: string | null;
  avatar: string | null;
  location: string | null;
  reputation: number | null;
  Ban: boolean;
  is_verified: boolean | null;
  team_id: string | null;
  team_name?: string | null;
  team_logo?: string | null;
}

// Fonction de recherche d'utilisateurs
async function searchUsers(query: string): Promise<UserResult[]> {
  try {
    // Try the main query first (without team join to avoid relationship issues)
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
      `)
      .eq('Ban', false)
      .limit(20);
    
    // Ajouter le filtre de recherche seulement si une requête est fournie
    if (query && query.length > 0) {
      queryBuilder = queryBuilder.or(`username.ilike.%${query}%,firstname.ilike.%${query}%,lastname.ilike.%${query}%`);
    }
    
    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Erreur lors de la recherche d\'utilisateurs:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    // Now get team information separately for users who have a team_id
    const usersWithTeams = await Promise.all(
      data.map(async (user) => {
        if (!user.team_id) {
          return {
            ...user,
            team_name: null,
            team_logo: null
          };
        }

        try {
          const { data: teamData, error: teamError } = await supabase
            .from('teams')
            .select('name, logo')
            .eq('id', user.team_id)
            .single();

          if (teamError || !teamData) {
            return {
              ...user,
              team_name: null,
              team_logo: null
            };
          }

          return {
            ...user,
            team_name: teamData.name,
            team_logo: teamData.logo
          };
        } catch (error) {
          console.error('Erreur lors de la récupération des données d\'équipe:', error);
          return {
            ...user,
            team_name: null,
            team_logo: null
          };
        }
      })
    );

    return usersWithTeams;
  } catch (error) {
    console.error('Erreur lors de la recherche d\'utilisateurs:', error);
    return [];
  }
}

export const useUserSearch = (searchQuery: string) => {
  // Utilisez useQuery pour mettre en cache et optimiser la recherche
  const {
    data: users = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['userSearch', searchQuery],
    queryFn: () => searchUsers(searchQuery),
    enabled: true, // Permettre la recherche même sans caractères minimum
    staleTime: 30000, // Cache valide pendant 30 secondes
    refetchOnWindowFocus: false,
  });

  // Déclencher la recherche lorsque la requête change, mais avec un délai
  useEffect(() => {
    const handler = setTimeout(() => {
      refetch();
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, refetch]);

  return {
    users,
    isLoading,
    refetch
  };
};
