
import React from 'react';
import UserCard from './UserCard';
import UserSearchEmpty from './UserSearchEmpty';
import UserSearchLoading from './UserSearchLoading';

interface User {
  id: string;
  username: string;
  firstname: string | null;
  lastname: string | null;
  avatar: string | null;
  location: string | null;
  reputation: number | null;
  ban: boolean;
  is_verified: boolean | null;
  team_info: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
}

interface UserSearchResultsProps {
  users: User[];
  isLoading: boolean;
  searchQuery: string;
}

const UserSearchResults: React.FC<UserSearchResultsProps> = ({ 
  users, 
  isLoading, 
  searchQuery 
}) => {
  const handleFriendAction = React.useCallback((userId: string, action: 'add' | 'remove') => {
    console.log(`Friend action: ${action} for user: ${userId}`);
    // TODO: Implement friend action logic
  }, []);

  if (isLoading) {
    return <UserSearchLoading />;
  }

  // Show initial message when no search query
  if (!searchQuery.trim()) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Tapez pour rechercher des joueurs...</p>
      </div>
    );
  }

  // Show empty results when search query exists but no results
  if (users.length === 0 && searchQuery.trim()) {
    return <UserSearchEmpty searchQuery={searchQuery} />;
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserCard 
          key={user.id} 
          user={user} 
          onFriendAction={handleFriendAction}
        />
      ))}
    </div>
  );
};

export default React.memo(UserSearchResults);
