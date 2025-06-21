import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, MapPin } from "lucide-react";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import UserActionButtons from './UserActionButtons';
import { useAuth } from '@/hooks/useAuth';
interface UserCardProps {
  user: {
    id: string;
    username: string;
    firstname?: string | null;
    lastname?: string | null;
    avatar?: string | null;
    location?: string | null;
    reputation?: number | null;
    ban?: boolean;
    is_verified?: boolean | null;
    team_info?: {
      id: string;
      name: string;
      logo: string | null;
    } | null;
  };
  friendshipStatus?: string;
  onFriendAction: (userId: string, action: 'add' | 'remove') => void;
}
const UserCard: React.FC<UserCardProps> = ({
  user,
  friendshipStatus,
  onFriendAction
}) => {
  const navigate = useNavigate();
  const {
    user: currentUser
  } = useAuth();
  const handleCardClick = (e: React.MouseEvent) => {
    // Éviter la navigation si on clique sur les boutons d'action
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    if (user.username) {
      console.log('Navigating to user profile:', user.username);
      navigate(`/user/${user.username}`);
    } else {
      console.error('No username available for navigation');
    }
  };
  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };
  const getDisplayName = () => {
    if (user.firstname && user.lastname) {
      return `${user.firstname} ${user.lastname}`;
    }
    return user.username;
  };
  const isCurrentUser = currentUser?.id === user.id;
  return <div className={`bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow ${user.ban ? 'opacity-60' : ''}`} onClick={handleCardClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar || ""} alt={user.username} />
              <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
            </Avatar>
            
            {user.team_info?.logo && <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-white overflow-hidden">
                <img src={user.team_info.logo} alt={user.team_info.name} className="w-full h-full object-cover" />
              </div>}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold truncate">{getDisplayName()}</h3>
              {user.is_verified && <VerifiedBadge size={18} />}
              {user.ban && <Badge variant="destructive" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Banni
                </Badge>}
            </div>
            
            <p className="text-sm text-gray-600 mb-2 text-left">@{user.username}</p>
            
            {user.location && <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{user.location}</span>
              </div>}
            
            <div className="flex items-center gap-4">
              {user.reputation !== null && user.reputation > 0 ? <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium">{user.reputation.toFixed(1)}</span>
                </div> : <span className="text-sm text-gray-500 italic">Non noté</span>}
              
              {user.team_info && <Badge variant="secondary" className="text-xs">
                  {user.team_info.name}
                </Badge>}
            </div>
          </div>
        </div>
        
        {/* Boutons d'action */}
        {!isCurrentUser && !user.ban && <div className="flex-shrink-0 ml-4">
            <UserActionButtons user={user} friendshipStatus={friendshipStatus} onFriendAction={onFriendAction} />
          </div>}
      </div>
    </div>;
};
export default UserCard;