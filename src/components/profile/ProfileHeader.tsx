
import React from 'react';
import { Settings, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VerifiedBadge } from "@/components/ui/verified-badge";

interface User {
  id?: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  bio?: string;
  location?: string;
  team?: string;
  team_name?: string;
  team_logo?: string;
  avatar?: string;
  banner?: string;
  reputation?: number | null;
  is_verified?: boolean;
}

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  toggleProfileSettings: () => void;
  onEditBio: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  user, 
  isOwnProfile, 
  toggleProfileSettings,
  onEditBio 
}) => {
  const getDisplayName = () => {
    if (user.firstname && user.lastname) {
      return `${user.firstname} ${user.lastname}`;
    }
    return user.username || 'Utilisateur';
  };

  return (
    <div className="relative">
      {/* Banner */}
      <div 
        className="h-48 bg-gradient-to-r from-airsoft-red to-red-600 rounded-t-lg bg-cover bg-center"
        style={user.banner ? { backgroundImage: `url(${user.banner})` } : undefined}
      />
      
      {/* Profile Content */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="absolute -top-16 left-6">
          <img 
            src={user.avatar || '/placeholder.svg'} 
            alt={user.username}
            className="w-32 h-32 rounded-full border-4 border-white bg-white object-cover"
          />
        </div>
        
        {/* Settings button (only for own profile) */}
        {isOwnProfile && (
          <div className="absolute top-4 right-4">
            <Button 
              onClick={toggleProfileSettings}
              variant="outline" 
              size="sm"
              className="bg-white hover:bg-gray-50"
            >
              <Settings className="h-4 w-4 mr-2" />
              Modifier le profil
            </Button>
          </div>
        )}
        
        {/* Profile Info */}
        <div className="pt-20">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {getDisplayName()}
            </h1>
            {user.is_verified && (
              <VerifiedBadge size={24} className="flex-shrink-0" />
            )}
          </div>
          
          <p className="text-gray-600 mb-1">@{user.username}</p>
          
          {user.reputation !== null && user.reputation > 0 && (
            <div className="flex items-center gap-1 mb-4">
              <Shield className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-600">Réputation: {user.reputation}</span>
            </div>
          )}
          
          {/* Team Info */}
          {user.team && (
            <div className="flex items-center gap-2 mb-4">
              {user.team_logo && (
                <img 
                  src={user.team_logo} 
                  alt={user.team}
                  className="w-6 h-6 rounded object-cover"
                />
              )}
              <span className="text-sm text-gray-600">
                Équipe: <span className="font-medium">{user.team}</span>
              </span>
            </div>
          )}
          
          {/* Location */}
          {user.location && (
            <p className="text-sm text-gray-600 mb-4">📍 {user.location}</p>
          )}
          
          {/* Bio */}
          <div className="space-y-2">
            {user.bio ? (
              <Card className="p-4 bg-gray-50">
                <p className="text-gray-700 whitespace-pre-wrap">{user.bio}</p>
                {isOwnProfile && (
                  <Button 
                    onClick={onEditBio}
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 text-xs"
                  >
                    Modifier la bio
                  </Button>
                )}
              </Card>
            ) : isOwnProfile ? (
              <Card className="p-4 bg-gray-50 border-dashed border-2">
                <p className="text-gray-500 text-sm mb-2">Aucune biographie ajoutée</p>
                <Button 
                  onClick={onEditBio}
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                >
                  Ajouter une bio
                </Button>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
