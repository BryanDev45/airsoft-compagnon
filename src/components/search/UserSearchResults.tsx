
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Star } from "lucide-react";

interface UserSearchResultsProps {
  searchQuery: string;
}

const UserSearchResults: React.FC<UserSearchResultsProps> = ({ searchQuery }) => {
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

  // Fonction de recherche d'utilisateurs
  async function searchUsers(query: string) {
    try {
      let queryBuilder = supabase
        .from('profiles')
        .select('id, username, firstname, lastname, avatar, location, reputation, Ban')
        .eq('Ban', false)
        .limit(20);
      
      // Ajouter le filtre de recherche seulement si une requête est fournie
      if (query && query.length > 0) {
        queryBuilder = queryBuilder.or(`username.ilike.%${query}%,firstname.ilike.%${query}%,lastname.ilike.%${query}%`);
      }
      
      const { data, error } = await queryBuilder;

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erreur lors de la recherche d\'utilisateurs:', error);
      return [];
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {searchQuery ? `Aucun joueur trouvé pour "${searchQuery}"` : 'Entrez votre recherche pour trouver des joueurs'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Link to={`/profile/${user.username}`} key={user.id}>
          <Card className="hover:bg-gray-50 transition duration-150">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.username} />
                  ) : (
                    <AvatarFallback>{user.username?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="font-medium">{user.username}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    {user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{user.reputation ? user.reputation.toFixed(1) : '0.0'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default UserSearchResults;
