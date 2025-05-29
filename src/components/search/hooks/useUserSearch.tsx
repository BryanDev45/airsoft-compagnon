
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { getStorageWithExpiry, setStorageWithExpiry, CACHE_DURATIONS } from '@/utils/cacheUtils';
import { globalQueryCache } from '@/utils/queryCache';

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

// Cache des équipes pour éviter les requêtes répétées
const teamCache = new Map<string, { name: string; logo: string | null }>();

async function searchUsers(query: string, isAdmin: boolean = false): Promise<UserResult[]> {
  const cacheKey = `userSearch_${query}_${isAdmin}`;
  
  // Utiliser le cache global pour éviter les recherches dupliquées
  return globalQueryCache.get(cacheKey, async () => {
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
    
    // Filtrer les utilisateurs bannis sauf pour les admins
    if (!isAdmin) {
      queryBuilder = queryBuilder.eq('Ban', false);
    }
    
    // Ajouter le filtre de recherche
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

    // Récupérer les informations d'équipe de manière optimisée
    const usersWithTeams = await Promise.all(
      data.map(async (user) => {
        let teamName = null;
        let teamLogo = null;
        let teamId = user.team_id;

        try {
          // Vérifier d'abord si l'utilisateur a un team_id direct
          if (user.team_id) {
            // Vérifier le cache des équipes
            if (teamCache.has(user.team_id)) {
              const cachedTeam = teamCache.get(user.team_id)!;
              teamName = cachedTeam.name;
              teamLogo = cachedTeam.logo;
            } else {
              const { data: teamData, error: teamError } = await supabase
                .from('teams')
                .select('name, logo')
                .eq('id', user.team_id)
                .single();

              if (!teamError && teamData) {
                teamName = teamData.name;
                teamLogo = teamData.logo;
                // Mettre en cache
                teamCache.set(user.team_id, { name: teamData.name, logo: teamData.logo });
              }
            }
          } else {
            // Vérifier si l'utilisateur est membre d'une équipe
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
              // Mettre en cache
              teamCache.set(memberData.team_id, { 
                name: memberData.teams.name, 
                logo: memberData.teams.logo 
              });
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
  }, CACHE_DURATIONS.SHORT); // Cache de 5 minutes pour les recherches
}

export const useUserSearch = (searchQuery: string) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  // Vérifier le statut admin avec cache
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const cacheKey = `adminStatus_${user.id}`;
        const cachedStatus = getStorageWithExpiry(cacheKey);
        
        if (cachedStatus !== null) {
          setIsAdmin(cachedStatus);
          return;
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('Admin')
          .eq('id', user.id)
          .single();
        
        const adminStatus = profileData?.Admin === true;
        setIsAdmin(adminStatus);
        
        // Cache le statut admin pour 1 heure
        setStorageWithExpiry(cacheKey, adminStatus, 60 * 60 * 1000);
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  // Débouncer la requête de recherche
  const debouncedSearchQuery = useMemo(() => {
    const timer = setTimeout(() => searchQuery, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Utiliser React Query avec cache optimisé
  const {
    data: users = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['userSearch', searchQuery, isAdmin],
    queryFn: () => searchUsers(searchQuery, isAdmin),
    enabled: searchQuery.length >= 0, // Permettre la recherche vide
    staleTime: CACHE_DURATIONS.SHORT, // 5 minutes
    gcTime: CACHE_DURATIONS.MEDIUM, // 30 minutes
    refetchOnWindowFocus: false,
  });

  return {
    users,
    isLoading,
    refetch
  };
};
