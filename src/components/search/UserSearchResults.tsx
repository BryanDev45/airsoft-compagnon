
import React from 'react';
import { useOptimizedUserSearch } from '@/hooks/search/useOptimizedUserSearch';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Shield, Ban } from 'lucide-react';

interface UserSearchResultsProps {
  searchQuery: string;
}

const UserSearchResults: React.FC<UserSearchResultsProps> = ({ searchQuery }) => {
  const { users, isLoading } = useOptimizedUserSearch(searchQuery);
  const navigate = useNavigate();

  console.log('UserSearchResults - searchQuery:', searchQuery);
  console.log('UserSearchResults - users:', users);
  console.log('UserSearchResults - isLoading:', isLoading);

  const handleUserClick = (username: string) => {
    navigate(`/user/${username}`);
  };

  if (isLoading) {
    console.log('UserSearchResults - Showing loading state');
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!users || users.length === 0) {
    console.log('UserSearchResults - No users found');
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">
          {searchQuery ? 'Aucun joueur trouvé pour cette recherche' : 'Commencez à taper pour rechercher des joueurs'}
        </p>
        {!searchQuery && (
          <p className="text-gray-400 text-sm mt-2">
            Tapez au moins un caractère pour lancer la recherche
          </p>
        )}
      </div>
    );
  }

  console.log('UserSearchResults - Rendering', users.length, 'users');

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card 
          key={user.id} 
          className={`cursor-pointer hover:shadow-md transition-shadow ${user.Ban ? 'opacity-60' : ''}`}
          onClick={() => !user.Ban && handleUserClick(user.username)}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.avatar || undefined} alt={user.username} />
                <AvatarFallback>
                  {user.username?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900 truncate">
                    {user.firstname && user.lastname 
                      ? `${user.firstname} ${user.lastname}` 
                      : user.username
                    }
                  </h3>
                  {user.is_verified && (
                    <div title="Compte vérifié">
                      <Shield className="h-4 w-4 text-blue-500" />
                    </div>
                  )}
                  {user.Ban && (
                    <div title="Utilisateur banni">
                      <Ban className="h-4 w-4 text-red-500" />
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                
                <div className="flex items-center gap-4 mt-2">
                  {user.location && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{user.location}</span>
                    </div>
                  )}
                  
                  {user.reputation !== null && user.reputation > 0 && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>{Number(user.reputation).toFixed(1)}</span>
                    </div>
                  )}
                </div>
                
                {user.team_name && (
                  <Badge variant="outline" className="mt-2">
                    {user.team_name}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserSearchResults;
