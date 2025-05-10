
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, MapPin, Calendar, Shield, Users } from 'lucide-react';

interface ProfileInfoProps {
  user: any;
  profileData: any;
  updateLocation?: (location: string) => Promise<boolean>;
  handleNavigateToTeam?: () => void;
  isOwnProfile?: boolean;
  handleEditProfile?: () => void;
  handleEditMedia?: () => void;
}

const ProfileInfo = ({
  user,
  profileData,
  updateLocation,
  handleNavigateToTeam,
  isOwnProfile = false,
  handleEditProfile,
  handleEditMedia
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Handler pour ouvrir le modal d'édition de profil
  const openEditProfileModal = () => {
    if (handleEditProfile) {
      handleEditProfile();
    }
  };

  const joinDate = profileData?.created_at
    ? new Date(profileData.created_at).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : "Date inconnue";

  return (
    <div className="space-y-6">
      {isOwnProfile && (
        <div className="flex justify-end">
          <Button 
            onClick={openEditProfileModal}
            variant="outline" 
            size="sm"
            className="group relative"
          >
            <Edit className="h-4 w-4 mr-2" />
            <span>Modifier le profil</span>
            
            {/* Dropdown menu pour les options d'édition */}
            <div className="absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (handleEditProfile) handleEditProfile();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Modifier le texte du profil
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (handleEditMedia) handleEditMedia();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Modifier l'avatar et la bannière
                </button>
              </div>
            </div>
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Colonne d'informations personnelles */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Informations personnelles</h3>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              <span>{profileData?.location || "Localisation non définie"}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-500 mr-2" />
              <span>Membre depuis {joinDate}</span>
            </div>
            
            {profileData?.team_name && (
              <div className="flex items-start">
                <Users className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Équipe</p>
                  <div className="flex items-center mt-1">
                    {profileData.team_logo && (
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={profileData.team_logo} alt={profileData.team_name} />
                        <AvatarFallback>{profileData.team_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <button 
                      className="text-airsoft-red hover:underline" 
                      onClick={handleNavigateToTeam}
                    >
                      {profileData.team_name}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {profileData?.preferred_role && (
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Rôle préféré</p>
                  <p>{profileData.preferred_role}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Colonne de biographie */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold">À propos</h3>
          <div className="bg-gray-50 p-4 rounded-md min-h-[120px]">
            <p className="whitespace-pre-wrap">{profileData?.bio || "Aucune biographie pour le moment."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
