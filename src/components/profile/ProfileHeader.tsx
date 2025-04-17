
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Edit,
  Mail,
  MessageCircle,
  UserPlus,
  MapPin,
  Calendar,
  Shield,
  Settings,
  CheckCircle2
} from "lucide-react";
import { Link } from 'react-router-dom';
import ReportUserButton from './ReportUserButton';

interface ProfileHeaderProps {
  user: any;
  isOwnProfile: boolean;
  setEditing?: (value: boolean) => void;
  toggleProfileSettings?: () => void;
}

const ProfileHeader = ({ user, isOwnProfile, setEditing, toggleProfileSettings }: ProfileHeaderProps) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-blue-600 to-airsoft-red"></div>
      <div className="px-6 py-4 flex flex-col sm:flex-row items-center sm:items-start relative">
        <div className="w-24 h-24 sm:w-32 sm:h-32 -mt-12 sm:-mt-16 rounded-full overflow-hidden border-4 border-white bg-white">
          <Avatar className="w-full h-full">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1 text-center sm:text-left sm:ml-4 mt-2 sm:mt-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
            {user.verified && (
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            )}
            {user.premium && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Premium
              </Badge>
            )}
          </div>
          
          <p className="text-gray-600">{user.bio}</p>
          
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
                <Link to={`/team/${user.teamId}`} className="hover:text-airsoft-red transition-colors">
                  {user.team}
                </Link>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              Membre depuis {user.memberSince}
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
              <ReportUserButton username={user.username} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
