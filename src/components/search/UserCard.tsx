
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, UserPlus, UserMinus, MessageSquare, Shield, Ban } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import TeamInviteButton from './TeamInviteButton';

interface UserResult {
  id: string;
  username: string;
  firstname: string | null;
  lastname: string | null;
  avatar: string | null;
  location: string | null;
  reputation: number | null;
  Ban: boolean;
  is_verified: boolean | null;
  team_id: string | null;
  team_name?: string | null;
  team_logo?: string | null;
}

interface UserCardProps {
  userData: UserResult;
  friendshipStatus?: string;
  onFriendAction: (targetUserId: string, action: 'add' | 'remove') => void;
}

const UserCard: React.FC<UserCardProps> = ({ userData, friendshipStatus, onFriendAction }) => {
  const { user } = useAuth();

  return (
    <Card className={`group overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 ${
      userData.Ban 
        ? 'border-l-red-500 bg-gradient-to-r from-red-50 to-gray-50/50 opacity-75' 
        : 'border-l-transparent hover:border-l-airsoft-red bg-gradient-to-r from-white to-gray-50/50'
    }`}>
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          {/* Avatar Section */}
          <div className="relative flex-shrink-0">
            <Avatar className={`h-14 w-14 ring-2 ring-white shadow-sm ${userData.Ban ? 'grayscale' : ''}`}>
              {userData.avatar ? (
                <AvatarImage src={userData.avatar} alt={userData.username} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-airsoft-red to-red-600 text-white font-semibold text-lg">
                  {userData.username?.substring(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              )}
            </Avatar>
            
            {/* Ban indicator overlay */}
            {userData.Ban && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                <Ban className="h-3 w-3 text-white" />
              </div>
            )}
            
            {/* Team logo */}
            {userData.team_logo && !userData.Ban && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-white overflow-hidden">
                <img 
                  src={userData.team_logo} 
                  alt={userData.team_name || 'Team'}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          
          {/* Info Section */}
          <Link 
            to={`/user/${userData.username}`} 
            className={`ml-4 flex-1 min-w-0 transition-colors duration-200 ${
              userData.Ban ? 'hover:text-red-600' : 'group-hover:text-airsoft-red'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold truncate transition-colors duration-200 ${
                userData.Ban 
                  ? 'text-red-700 hover:text-red-800' 
                  : 'text-gray-900 group-hover:text-airsoft-red'
              }`}>
                {userData.username}
              </h3>
              {userData.Ban && (
                <Badge variant="destructive" className="text-xs px-2 py-0.5 bg-red-100 text-red-800 border-red-200">
                  Banni
                </Badge>
              )}
              {userData.is_verified && !userData.Ban && (
                <Shield className="h-4 w-4 text-blue-500 flex-shrink-0" />
              )}
              {userData.team_name && !userData.Ban && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  {userData.team_name}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4">
              {userData.location && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate max-w-32">{userData.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                <span className="font-medium text-gray-700">
                  {userData.reputation ? userData.reputation.toFixed(1) : '0.0'}
                </span>
              </div>
            </div>
          </Link>
          
          {/* Action Buttons */}
          {user && user.id !== userData.id && !userData.Ban && (
            <div className="flex gap-2 ml-4 flex-shrink-0">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-9 w-9 p-0 border-airsoft-red text-airsoft-red hover:bg-airsoft-red hover:text-white transition-all duration-200" 
                title="Envoyer un message"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              
              {friendshipStatus === 'accepted' ? (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-9 w-9 p-0 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200" 
                  title="Supprimer des amis"
                  onClick={() => onFriendAction(userData.id, 'remove')}
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              ) : friendshipStatus === 'pending' ? (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-9 w-9 p-0 border-yellow-500 text-yellow-500 bg-yellow-50 cursor-not-allowed" 
                  title="Demande en cours"
                  disabled
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-9 w-9 p-0 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-200" 
                  title="Ajouter en ami"
                  onClick={() => onFriendAction(userData.id, 'add')}
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              )}

              {/* Team invitation button - only show if player has no team */}
              {!userData.team_id && (
                <TeamInviteButton
                  targetUserId={userData.id}
                  targetUsername={userData.username}
                />
              )}
            </div>
          )}

          {/* Banned user - no action buttons available */}
          {userData.Ban && (
            <div className="ml-4 flex-shrink-0">
              <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                <Ban className="h-3 w-3 mr-1" />
                Utilisateur banni
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
