
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Users, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TeamSearchResultsProps {
  searchQuery: string;
}

interface TeamResult {
  id: string;
  name: string;
  logo: string | null;
  location: string | null;
  member_count: number;
  rating: number;
  is_recruiting: boolean;
  is_association: boolean;
}

const TeamSearchResults: React.FC<TeamSearchResultsProps> = ({ searchQuery }) => {
  // Utilisez useQuery pour optimiser la recherche et la mise en cache
  const {
    data: teams = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['teamSearch', searchQuery],
    queryFn: () => searchTeams(searchQuery),
    enabled: true, // Permettre la recherche même sans caractères minimum
    staleTime: 30000, // Cache valide pendant 30 secondes
    refetchOnWindowFocus: false,
  });

  // Déclencher la recherche avec un délai lorsque la requête change
  useEffect(() => {
    const handler = setTimeout(() => {
      refetch();
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, refetch]);

  // Fonction de recherche d'équipes
  async function searchTeams(query: string) {
    try {
      let queryBuilder = supabase
        .from('teams')
        .select('id, name, logo, location, member_count, rating, is_recruiting, is_association')
        .limit(20);
      
      // Ajouter le filtre de recherche seulement si une requête est fournie
      if (query && query.length > 0) {
        queryBuilder = queryBuilder.or(`name.ilike.%${query}%,location.ilike.%${query}%`);
      }
      
      const { data, error } = await queryBuilder;

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erreur lors de la recherche d\'équipes:', error);
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
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {searchQuery ? `Aucune équipe trouvée pour "${searchQuery}"` : 'Entrez votre recherche pour trouver des équipes'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {teams.map((team: TeamResult) => (
        <Link to={`/team/${team.id}`} key={team.id}>
          <Card className="hover:bg-gray-50 transition duration-150">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  {team.logo ? (
                    <AvatarImage src={team.logo} alt={team.name} />
                  ) : (
                    <AvatarFallback>{team.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{team.name}</h3>
                    {team.is_association && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">Association</Badge>
                    )}
                  </div>
                  <div className="flex items-center flex-wrap gap-3 text-sm text-gray-500 mt-1">
                    {team.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{team.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{team.member_count || 0} membres</span>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1">
                            <Star className={`h-3 w-3 ${team.rating > 0 ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
                            <span>{team.rating > 0 ? team.rating.toFixed(1) : "Non notée"}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Notation de l'équipe</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                {team.is_recruiting && (
                  <Badge className="bg-green-500 hover:bg-green-600">Recrutement</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default TeamSearchResults;
