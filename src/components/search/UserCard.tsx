
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, UserPlus, UserMinus, MessageSquare, Shield } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

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
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-transparent hover:border-l-airsoft-red bg-gradient-to-r from-white to-gray-50/50">
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          {/* Avatar Section */}
          <div className="relative flex-shrink-0">
            <Avatar className="h-14 w-14 ring-2 ring-white shadow-sm">
              {userData.avatar ? (
                <AvatarImage src={userData.avatar} alt={userData.username} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-airsoft-red to-red-600 text-white font-semibold text-lg">
                  {userData.username?.substring(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              )}
            </Avatar>
            
            {/* Team logo ou online indicator */}
            {userData.team_logo ? (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-white overflow-hidden">
                <img 
                  src={userData.team_logo} 
                  alt={userData.team_name || 'Team'}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          
          {/* Info Section - Now with username on the left */}
          <Link 
            to={`/user/${userData.username}`} 
            className="ml-4 flex-1 min-w-0 group-hover:text-airsoft-red transition-colors duration-200"
          >
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-airsoft-red transition-colors duration-200">
                {userData.username}
              </h3>
              {userData.is_verified && (
                <Shield className="h-4 w-4 text-blue-500 flex-shrink-0" />
              )}
              {userData.team_name && (
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
          {user && user.id !== userData.id && (
            <div className="flex gap-2 ml-4 flex-shrink-0">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-9 w-9 p-0 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200" 
                title="Envoyer un message"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              
              {friendshipStatus === 'accepted' ? (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-9 w-9 p-0 border-red-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all duration-200" 
                  title="Supprimer des amis"
                  onClick={() => onFriendAction(userData.id, 'remove')}
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              ) : friendshipStatus === 'pending' ? (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-9 w-9 p-0 border-gray-200 bg-gray-50 cursor-not-allowed" 
                  title="Demande en cours"
                  disabled
                >
                  <UserPlus className="h-4 w-4 text-gray-400" />
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-9 w-9 p-0 border-green-200 hover:border-green-300 hover:bg-green-50 hover:text-green-600 transition-all duration-200" 
                  title="Ajouter en ami"
                  onClick={() => onFriendAction(userData.id, 'add')}
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
