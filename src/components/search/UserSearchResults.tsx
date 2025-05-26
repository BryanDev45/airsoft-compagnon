
import React from 'react';
import { useUserSearch } from './hooks/useUserSearch';
import { useFriendshipActions } from './hooks/useFriendshipActions';
import UserCard from './UserCard';
import UserSearchLoading from './UserSearchLoading';
import UserSearchEmpty from './UserSearchEmpty';

interface UserSearchResultsProps {
  searchQuery: string;
}

const UserSearchResults: React.FC<UserSearchResultsProps> = ({ searchQuery }) => {
  const { users, isLoading, refetch } = useUserSearch(searchQuery);
  const { friendships, handleFriendAction } = useFriendshipActions(users);

  const handleFriendActionWithRefresh = async (targetUserId: string, action: 'add' | 'remove') => {
    await handleFriendAction(targetUserId, action);
    // Rafraîchir les résultats
    refetch();
  };

  if (isLoading) {
    return <UserSearchLoading />;
  }

  if (users.length === 0) {
    return <UserSearchEmpty searchQuery={searchQuery} />;
  }

  return (
    <div className="space-y-3">
      {users.map((userData) => (
        <UserCard
          key={userData.id}
          userData={userData}
          friendshipStatus={friendships[userData.id]}
          onFriendAction={handleFriendActionWithRefresh}
        />
      ))}
    </div>
  );
};

export default UserSearchResults;
