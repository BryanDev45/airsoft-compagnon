
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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
async function searchUsers(query: string, isAdmin: boolean = false): Promise<UserResult[]> {
  try {
    // First, get the basic user profiles
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
      .limit(20);
    
    // Si ce n'est pas un admin, exclure les utilisateurs bannis
    if (!isAdmin) {
      queryBuilder = queryBuilder.eq('Ban', false);
    }
    
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

    // Now get team information for each user
    const usersWithTeams = await Promise.all(
      data.map(async (user) => {
        let teamName = null;
        let teamLogo = null;
        let teamId = user.team_id;

        try {
          // First check if the user has a direct team_id (for team leaders)
          if (user.team_id) {
            const { data: teamData, error: teamError } = await supabase
              .from('teams')
              .select('name, logo')
              .eq('id', user.team_id)
              .single();

            if (!teamError && teamData) {
              teamName = teamData.name;
              teamLogo = teamData.logo;
            }
          } else {
            // If no direct team_id, check if the user is a team member
            const { data: memberData, error: memberError } = await supabase
              .from('team_members')
              .select(`
                team_id,
                teams (
                  id,
                  name,
                  logo
                )
              `)
              .eq('user_id', user.id)
              .eq('status', 'confirmed')
              .single();

            if (!memberError && memberData?.teams) {
              teamId = memberData.team_id;
              teamName = memberData.teams.name;
              teamLogo = memberData.teams.logo;
            }
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données d\'équipe:', error);
        }

        return {
          ...user,
          team_id: teamId,
          team_name: teamName,
          team_logo: teamLogo
        };
      })
    );

    return usersWithTeams;
  } catch (error) {
    console.error('Erreur lors de la recherche d\'utilisateurs:', error);
    return [];
  }
}

export const useUserSearch = (searchQuery: string) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  // Vérifier si l'utilisateur est admin
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

  // Utilisez useQuery pour mettre en cache et optimiser la recherche
  const {
    data: users = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['userSearch', searchQuery, isAdmin],
    queryFn: () => searchUsers(searchQuery, isAdmin),
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
