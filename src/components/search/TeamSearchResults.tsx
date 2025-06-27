
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Star, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from 'react-router-dom';
import TeamApplicationButton from './TeamApplicationButton';
import { useAuth } from '@/hooks/useAuth';

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
  rating?: number;
}

interface TeamSearchResultsProps {
  teams: Team[];
  isLoading: boolean;
  searchQuery: string;
}

const TeamSearchResults: React.FC<TeamSearchResultsProps> = ({ 
  teams, 
  isLoading, 
  searchQuery 
}) => {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Show empty results only when search query exists but no results
  if (teams.length === 0 && searchQuery.trim()) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucune équipe trouvée
        </h3>
        <p className="text-gray-500">
          Aucune équipe ne correspond à votre recherche "{searchQuery}"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {teams.map((team) => (
        <div 
          key={team.id} 
          className="group overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-transparent hover:border-l-airsoft-red bg-gradient-to-r from-white to-gray-50/50 rounded-lg shadow-md"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <Avatar className="w-16 h-16 ring-2 ring-white shadow-sm">
                  <AvatarImage src={team.logo || ''} alt={team.name} />
                  <AvatarFallback className="bg-gradient-to-br from-airsoft-red to-red-600 text-white text-xl font-bold">
                    {team.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Link 
                      to={`/team/${team.id}`}
                      className="text-xl font-semibold text-gray-900 hover:text-airsoft-red transition-colors duration-200 group-hover:text-airsoft-red"
                    >
                      {team.name}
                    </Link>
                    {team.is_association && (
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        <Shield className="h-3 w-3 mr-1" />
                        Association
                      </Badge>
                    )}
                  </div>
                  
                  {team.description && (
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {team.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {team.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{team.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{team.member_count || 0} membres</span>
                    </div>
                    
                    {team.rating && team.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{team.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                {team.is_recruiting && (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Recrute
                  </Badge>
                )}
                {user && !user.team_id && team.is_recruiting && team.leader_id && (
                  <TeamApplicationButton 
                    teamId={team.id} 
                    teamName={team.name}
                    leaderId={team.leader_id}
                    isRecruiting={team.is_recruiting}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </div>
      ))}
    </div>
  );
};

export default React.memo(TeamSearchResults);
