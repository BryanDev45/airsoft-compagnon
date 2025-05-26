
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
    // Recherche des utilisateurs avec jointure sur les équipes et les memberships
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
        team_members!inner(
          team_id,
          status,
          teams!inner(
            id,
            name,
            logo
          )
        )
      `)
      .eq('Ban', false)
      .eq('team_members.status', 'confirmed')
      .limit(20);
    
    // Ajouter le filtre de recherche seulement si une requête est fournie
    if (query && query.length > 0) {
      queryBuilder = queryBuilder.or(`username.ilike.%${query}%,firstname.ilike.%${query}%,lastname.ilike.%${query}%`);
    }
    
    const { data: usersWithTeams, error: teamsError } = await queryBuilder;

    // Recherche des utilisateurs sans équipe
    let noTeamQueryBuilder = supabase
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
      .is('team_id', null)
      .limit(20);
    
    // Ajouter le filtre de recherche seulement si une requête est fournie
    if (query && query.length > 0) {
      noTeamQueryBuilder = noTeamQueryBuilder.or(`username.ilike.%${query}%,firstname.ilike.%${query}%,lastname.ilike.%${query}%`);
    }
    
    const { data: usersWithoutTeams, error: noTeamError } = await noTeamQueryBuilder;

    // Combiner les résultats
    const allUsers: UserResult[] = [];

    // Traiter les utilisateurs avec équipes
    if (usersWithTeams && !teamsError) {
      usersWithTeams.forEach((user: any) => {
        if (user.team_members && user.team_members.length > 0) {
          const teamData = user.team_members[0].teams;
          allUsers.push({
            id: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            avatar: user.avatar,
            location: user.location,
            reputation: user.reputation,
            Ban: user.Ban,
            is_verified: user.is_verified,
            team_id: user.team_id,
            team_name: teamData?.name || null,
            team_logo: teamData?.logo || null
          });
        }
      });
    }

    // Traiter les utilisateurs sans équipes
    if (usersWithoutTeams && !noTeamError) {
      usersWithoutTeams.forEach((user: any) => {
        allUsers.push({
          ...user,
          team_name: null,
          team_logo: null
        });
      });
    }

    // Supprimer les doublons basés sur l'ID utilisateur
    const uniqueUsers = allUsers.filter((user, index, self) => 
      index === self.findIndex(u => u.id === user.id)
    );

    return uniqueUsers;
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
