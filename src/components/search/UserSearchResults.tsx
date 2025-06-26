
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
  if (isLoading) {
    return <UserSearchLoading />;
  }

  if (!searchQuery.trim()) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Tapez pour rechercher des joueurs...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return <UserSearchEmpty searchQuery={searchQuery} />;
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UserSearchResults;
