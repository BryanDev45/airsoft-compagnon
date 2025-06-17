
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, Pencil, Star, ShieldCheck } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ProfileHeaderProps {
  user: {
    username?: string | null;
    avatar?: string | null;
    banner?: string | null;
    bio?: string | null;
    reputation?: number | null;
    team_logo?: string | null;
    team_name?: string | null;
    team?: string | null;
    Admin?: boolean | null;
    is_verified?: boolean | null;
  };
  isOwnProfile?: boolean;
  toggleProfileSettings?: () => void;
  onEditBio?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isOwnProfile = false,
  toggleProfileSettings,
  onEditBio
}) => {
  const isMobile = useIsMobile();

  const SettingsButton = ({ children }: { children: React.ReactNode }) => (
    <Button variant="outline" size="sm" className="w-9 p-2 md:w-auto md:px-3">
      <Settings className="h-4 w-4" />
      <span className="hidden md:inline">Paramètres</span>
    </Button>
  );

  const EditButton = ({ children }: { children: React.ReactNode }) => (
    <Button variant="outline" size="sm" className="w-9 p-2 md:w-auto md:px-3">
      <Pencil className="h-4 w-4" />
      <span className="hidden md:inline">Modifier le profil</span>
    </Button>
  );

  return (
    <div className="relative">
      <div className="w-full h-64 md:h-72 bg-black overflow-hidden">
        {user?.banner ? (
          <img src={user.banner} alt="Profile banner" className="w-full h-full object-contain md:object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-400 to-gray-300" />
        )}
      </div>
      
      <div className="px-4 sm:px-6 pb-4 pt-16 relative">
        {/* Moved buttons to the top with adjusted positioning */}
        {isOwnProfile && (
          <div className="absolute top-4 right-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 items-end md:items-center">
            {onEditBio && (
              isMobile ? (
                <Drawer>
                  <DrawerTrigger asChild>
                    <EditButton>Modifier le profil</EditButton>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Modifier le profil</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4">
                      <Button onClick={onEditBio} className="w-full">
                        Ouvrir l'éditeur de profil
                      </Button>
                    </div>
                  </DrawerContent>
                </Drawer>
              ) : (
                <Button variant="outline" size="sm" onClick={onEditBio} className="w-9 p-2 md:w-auto md:px-3">
                  <Pencil className="h-4 w-4" />
                  <span className="hidden md:inline">Modifier le profil</span>
                </Button>
              )
            )}
            
            {toggleProfileSettings && (
              isMobile ? (
                <Drawer>
                  <DrawerTrigger asChild>
                    <SettingsButton>Paramètres</SettingsButton>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Paramètres du profil</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4">
                      <Button onClick={toggleProfileSettings} className="w-full">
                        Ouvrir les paramètres
                      </Button>
                    </div>
                  </DrawerContent>
                </Drawer>
              ) : (
                <Button variant="outline" size="sm" onClick={toggleProfileSettings} className="w-9 p-2 md:w-auto md:px-3">
                  <Settings className="h-4 w-4" />
                  <span className="hidden md:inline">Paramètres</span>
                </Button>
              )
            )}
          </div>
        )}

        <div className="absolute -top-12 left-4 sm:left-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md ring-2 ring-airsoft-red">
              <AvatarImage src={user?.avatar || undefined} alt={user?.username || 'Utilisateur'} />
              <AvatarFallback>{user?.username?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            
            {/* Team logo overlay - positioned at bottom right */}
            {user?.team_logo && (
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border-2 border-white overflow-hidden shadow-sm">
                <img src={user.team_logo} alt={user.team_name || user.team || 'Team'} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{user?.username || 'Utilisateur'}</h1>
              {user?.is_verified && <VerifiedBadge size={24} />}
              {user?.reputation && user.reputation > 0 ? (
                <div className="flex items-center bg-amber-50 px-2 py-1 rounded-full">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                  <span className="text-sm font-medium text-amber-700">{user.reputation.toFixed(1)}</span>
                </div>
              ) : (
                <div className="flex items-center bg-gray-50 px-2 py-1 rounded-full">
                  <span className="text-sm text-gray-500 italic">non noté</span>
                </div>
              )}
            </div>
            
            {user?.Admin && (
              <div className="flex items-center mt-1">
                <Badge className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1 text-white">
                  <ShieldCheck className="h-3 w-3" />
                  Administrateur
                </Badge>
              </div>
            )}
            
            <p className="text-gray-600 mt-1 text-left">{user?.bio || 'Aucune bio pour le moment'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
