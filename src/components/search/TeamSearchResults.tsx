
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, UserPlus, Star } from "lucide-react";
import { Link } from 'react-router-dom';
import TeamApplicationButton from './TeamApplicationButton';
import { useTeamSearch } from './hooks/useTeamSearch';
interface TeamSearchResultsProps {
  searchQuery: string;
}
const TeamSearchResults: React.FC<TeamSearchResultsProps> = ({
  searchQuery
}) => {
  const {
    data: teams = [],
    isLoading
  } = useTeamSearch(searchQuery);
  if (isLoading) {
    return <div className="space-y-4">
        {[...Array(3)].map((_, i) => <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>)}
      </div>;
  }
  if (teams.length === 0) {
    return <div className="text-center py-8">
        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {searchQuery.trim() ? 'Aucune équipe trouvée' : 'Aucune équipe disponible'}
        </h3>
        <p className="text-gray-500">
          {searchQuery.trim() ? 'Essayez de modifier vos critères de recherche' : 'Il n\'y a actuellement aucune équipe enregistrée'}
        </p>
      </div>;
  }
  return <div className="space-y-3">
      {teams.map(team => <Card key={team.id} className="group overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-transparent hover:border-l-airsoft-red bg-gradient-to-r from-white to-gray-50/50">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4">
              {/* Team Logo */}
              <div className="flex-shrink-0">
                <Avatar className="h-16 w-16 ring-2 ring-white shadow-sm">
                  {team.logo ? <AvatarImage src={team.logo} alt={team.name} /> : <AvatarFallback className="bg-gradient-to-br from-airsoft-red to-red-600 text-white font-semibold text-lg">
                      {team.name?.substring(0, 2).toUpperCase() || 'T'}
                    </AvatarFallback>}
                </Avatar>
              </div>
              
              {/* Team Info */}
              <Link to={`/team/${team.id}`} className="w-full sm:ml-4 flex-1 min-w-0 transition-colors duration-200 group-hover:text-airsoft-red">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg truncate transition-colors duration-200 text-gray-900 group-hover:text-airsoft-red">
                    {team.name}
                  </h3>
                  
                  <div className="flex gap-2">
                    {team.is_recruiting && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                        <UserPlus className="h-3 w-3 mr-1" />
                        Recrute
                      </Badge>}
                    {team.is_association && <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                        Association
                      </Badge>}
                  </div>
                </div>
                
                {team.description && <p className="text-gray-600 text-sm mb-2 line-clamp-2 text-left">
                    {team.description}
                  </p>}
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {team.location && <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate max-w-32">{team.location}</span>
                    </div>}
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{team.member_count || 0} membres</span>
                  </div>
                  {team.rating && team.rating > 0 && <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 flex-shrink-0 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{team.rating.toFixed(1)}</span>
                    </div>}
                </div>
              </Link>
              
              {/* Action Buttons */}
              <div className="flex gap-2 sm:ml-4 flex-shrink-0 self-end sm:self-auto">
                {team.is_recruiting && team.leader_id && <TeamApplicationButton teamId={team.id} teamName={team.name} leaderId={team.leader_id} isRecruiting={team.is_recruiting} />}
              </div>
            </div>
          </CardContent>
        </Card>)}
    </div>;
};
export default TeamSearchResults;
