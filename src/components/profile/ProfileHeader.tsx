
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, Pencil, Star } from 'lucide-react';

const ProfileHeader = ({
  user,
  isOwnProfile = false,
  toggleProfileSettings,
  onEditBio
}) => {
  return (
    <div className="relative">
      <div className="w-full h-64 md:h-72 bg-gray-200 overflow-hidden">
        {user?.banner ? (
          <img src={user.banner} alt="Profile banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-400 to-gray-300" />
        )}
      </div>
      
      <div className="px-6 pb-4 pt-16 relative">
        <div className="absolute -top-12 left-6">
          <Avatar className="h-24 w-24 border-4 border-white shadow-md ring-2 ring-airsoft-red">
            <AvatarImage src={user?.avatar} alt={user?.username || 'Utilisateur'} />
            <AvatarFallback>{user?.username?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{user?.username || 'Utilisateur'}</h1>
              {user?.reputation && <div className="flex items-center bg-amber-50 px-2 py-1 rounded-full">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                  <span className="text-sm font-medium text-amber-700">{user.reputation.toFixed(1)}</span>
                </div>}
            </div>
            <p className="text-gray-600 mt-1">{user?.bio || 'Aucune bio pour le moment'}</p>
          </div>
          
          {isOwnProfile && <div className="mt-4 md:mt-0 flex space-x-2">
              {onEditBio && <Button variant="outline" size="sm" onClick={onEditBio}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Modifier le profil
                </Button>}
              
              {toggleProfileSettings && <Button variant="outline" size="sm" onClick={toggleProfileSettings}>
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Button>}
            </div>}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
