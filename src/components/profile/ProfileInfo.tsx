
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CitySearchCombobox } from "@/components/profile/CitySearchCombobox";
import { toast } from "@/components/ui/use-toast";
import { MapPin, Users, Calendar, Flag } from "lucide-react";

const ProfileInfo = ({ user, profileData, updateLocation, handleNavigateToTeam, isOwnProfile = false }) => {
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [location, setLocation] = useState(profileData?.location || '');

  const handleEditLocation = () => {
    setIsEditingLocation(true);
  };

  const handleSaveLocation = async () => {
    if (!location) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une localisation valide",
        variant: "destructive"
      });
      return;
    }

    const success = await updateLocation(location);
    if (success) {
      setIsEditingLocation(false);
    }
  };

  const handleCancelEditLocation = () => {
    setLocation(profileData?.location || '');
    setIsEditingLocation(false);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Informations personnelles</h3>
            
            <div className="space-y-4 bg-gray-50 rounded-lg p-4">
              {profileData?.firstname && profileData?.lastname && (
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Nom complet</span>
                  <span>{profileData.firstname} {profileData.lastname}</span>
                </div>
              )}
              
              {profileData?.age && (
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Âge</span>
                  <span>{profileData.age} ans</span>
                </div>
              )}

              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Localisation</span>
                {isEditingLocation ? (
                  <div className="space-y-2">
                    <CitySearchCombobox
                      onSelect={setLocation}
                      defaultValue={location}
                    />
                    <div className="flex space-x-2 mt-2">
                      <Button 
                        size="sm" 
                        onClick={handleSaveLocation}
                        className="bg-airsoft-red hover:bg-red-700"
                      >
                        Enregistrer
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEditLocation}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-airsoft-red mr-1" />
                    <span>{profileData?.location || 'Non spécifiée'}</span>
                    {isOwnProfile && (
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={handleEditLocation}
                        className="ml-2 h-7 px-2"
                      >
                        Modifier
                      </Button>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Membre depuis</span>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-airsoft-red mr-1" />
                  <span>{profileData?.join_date 
                    ? new Date(profileData.join_date).toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'}) 
                    : 'Information non disponible'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Autres sections selon vos besoins */}
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Équipe</h3>
            
            <div className="bg-gray-50 rounded-lg p-4">
              {profileData?.team ? (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <Flag className="h-4 w-4 text-airsoft-red mr-1" />
                    <span className="font-medium">{profileData.team}</span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleNavigateToTeam}
                    className="mt-2"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Voir l'équipe
                  </Button>
                </div>
              ) : isOwnProfile ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <p className="text-gray-500 mb-2">Vous n'êtes pas membre d'une équipe</p>
                  <Button 
                    variant="default"
                    size="sm"
                    onClick={handleNavigateToTeam}
                    className="bg-airsoft-red hover:bg-red-700"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Créer une équipe
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500 py-2">Aucune équipe</p>
              )}
            </div>
          </div>
          
          {/* Autres sections selon vos besoins */}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
