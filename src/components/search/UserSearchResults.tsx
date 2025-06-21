
import React from 'react';
import { useOptimizedUserSearch } from '@/hooks/search/useOptimizedUserSearch';
import { Card, CardContent } from "@/components/ui/card";
import { useFriendshipActions } from './hooks/useFriendshipActions';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import UserCard from './UserCard';

interface UserSearchResultsProps {
  searchQuery: string;
}

const UserSearchResults: React.FC<UserSearchResultsProps> = ({ searchQuery }) => {
  const { users, isLoading } = useOptimizedUserSearch(searchQuery);
  const { friendships, handleFriendAction } = useFriendshipActions(users);
  const { user: currentUser } = useAuth();

  // Récupérer le statut d'admin d'équipe de l'utilisateur actuel
  const { data: currentUserTeamInfo } = useQuery({
    queryKey: ['currentUserTeamInfo', currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('team_id, is_team_leader')
        .eq('id', currentUser.id)
        .single();
      
      if (error || !data) return null;
      
      return {
        teamId: data.team_id,
        isTeamLeader: data.is_team_leader
      };
    },
    enabled: !!currentUser?.id,
  });

  const isCurrentUserTeamAdmin = currentUserTeamInfo?.isTeamLeader && currentUserTeamInfo?.teamId;

  console.log('UserSearchResults - searchQuery:', searchQuery);
  console.log('UserSearchResults - users:', users);
  console.log('UserSearchResults - isLoading:', isLoading);
  console.log('UserSearchResults - isCurrentUserTeamAdmin:', isCurrentUserTeamAdmin);

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

  // Afficher un message si aucun résultat n'est trouvé
  if (!users || users.length === 0) {
    console.log('UserSearchResults - No users found');
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">
          {searchQuery && searchQuery.trim().length > 0 
            ? `Aucun joueur trouvé pour "${searchQuery}"` 
            : 'Tapez dans la barre de recherche pour trouver des joueurs'
          }
        </p>
        {searchQuery && searchQuery.trim().length > 0 && (
          <p className="text-gray-400 text-sm mt-2">
            Essayez avec un autre terme de recherche
          </p>
        )}
      </div>
    );
  }

  console.log('UserSearchResults - Rendering', users.length, 'users');

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          friendshipStatus={friendships[user.id]}
          isCurrentUserTeamAdmin={isCurrentUserTeamAdmin}
          onFriendAction={handleFriendAction}
        />
      ))}
    </div>
  );
};

export default UserSearchResults;
