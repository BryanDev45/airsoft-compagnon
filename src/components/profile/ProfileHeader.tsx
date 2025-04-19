
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Edit,
  Image,
  MessageCircle,
  UserPlus,
  Shield,
  MapPin,
  Calendar,
  CheckCircle2,
  Settings,
  Star
} from "lucide-react";
import { Link } from 'react-router-dom';
import ReportUserButton from './ReportUserButton';

interface ProfileHeaderProps {
  user: any;
  isOwnProfile: boolean;
  setEditing?: (value: boolean) => void;
  toggleProfileSettings?: () => void;
  onEditBio?: () => void;
}

const ProfileHeader = ({ user, isOwnProfile, setEditing, toggleProfileSettings, onEditBio }: ProfileHeaderProps) => {
  // Ajout d'une vérification pour s'assurer que user n'est pas null
  if (!user) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-airsoft-red"></div>
        <div className="px-6 py-4 flex items-center justify-center">
          <p>Chargement des données utilisateur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-blue-600 to-airsoft-red">
        {user.banner && (
          <img 
            src={user.banner} 
            alt="Bannière de profil" 
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="px-6 py-4 flex flex-col sm:flex-row items-center sm:items-start relative">
        <div className="w-24 h-24 sm:w-32 sm:h-32 -mt-12 sm:-mt-16 rounded-full overflow-hidden border-4 border-white bg-white relative group">
          <Avatar className="w-full h-full">
            <AvatarImage src={user.avatar} alt={user.username || 'Utilisateur'} />
            <AvatarFallback>{(user.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          {isOwnProfile && (
            <div 
              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all cursor-pointer"
              onClick={() => setEditing?.(true)}
            >
              <Image className="text-white opacity-0 group-hover:opacity-100 h-8 w-8" />
            </div>
          )}
        </div>
        
        <div className="flex-1 text-center sm:text-left sm:ml-4 mt-2 sm:mt-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{user.username || 'Utilisateur'}</h1>
            
            {/* Rating display */}
            <div className="flex items-center text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 text-sm">{user.rating || 4.5}</span>
            </div>
            
            {user.verified && (
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            )}
            {user.premium && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Premium
              </Badge>
            )}
          </div>
          
          <div className="relative group">
            <p className="text-gray-600 pr-6">{user.bio || 'Aucune biographie'}</p>
            {isOwnProfile && (
              <Button 
                onClick={onEditBio} 
                variant="ghost" 
                size="sm" 
                className="absolute right-0 top-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 mt-3 text-sm text-gray-600">
            {user.location && (
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                {user.location}
              </div>
            )}
            
            {user.team && (
              <div className="flex items-center gap-1">
                <Shield size={16} />
                <Link to={`/team/${user.team_id}`} className="hover:text-airsoft-red transition-colors">
                  {user.team}
                </Link>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              Membre depuis {user.join_date ? new Date(user.join_date).toLocaleDateString('fr-FR') : 'N/A'}
            </div>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-0 flex flex-wrap justify-center sm:justify-end items-center gap-2">
          {isOwnProfile ? (
            <>
              <Button 
                onClick={() => setEditing?.(true)} 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
              >
                <Edit size={16} />
                Modifier profil
              </Button>
              <Button 
                onClick={toggleProfileSettings} 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
              >
                <Settings size={16} />
                Paramètres
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <MessageCircle size={16} />
                Message
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <UserPlus size={16} />
                Ajouter
              </Button>
              <ReportUserButton username={user.username || 'Utilisateur'} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
