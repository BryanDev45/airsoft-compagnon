
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, User, Edit, Save, X, Users } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ComboboxDemo } from "./CityCombobox";

const ProfileInfo = ({ user, profileData, updateLocation, handleNavigateToTeam }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [location, setLocation] = useState(profileData?.location || '');
  const [selectedCity, setSelectedCity] = useState(null);

  const handleSave = async () => {
    try {
      const updatedLocation = selectedCity ? `${selectedCity.city}, ${selectedCity.country}` : location;
      await updateLocation(updatedLocation);
      setLocation(updatedLocation);
      setIsEditing(false);
      toast({
        title: "Localisation mise à jour",
        description: "Votre localisation a été mise à jour avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre localisation",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    setLocation(profileData?.location || '');
  }, [profileData]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Informations personnelles</h2>
        {!isEditing ? (
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="bg-airsoft-red hover:bg-red-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              className="bg-airsoft-red hover:bg-red-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <User className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nom</h3>
              <p className="text-lg">{profileData?.firstname || 'Non spécifié'} {profileData?.lastname || ''}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date d'inscription</h3>
              <p className="text-lg">{formatDate(profileData?.join_date)}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Users className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Équipe</h3>
              {profileData?.team ? (
                <button 
                  onClick={handleNavigateToTeam} 
                  className="text-lg text-airsoft-red hover:underline"
                >
                  {profileData.team}
                </button>
              ) : (
                <p className="text-lg">Aucune équipe</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
            <div className="w-full">
              <h3 className="text-sm font-medium text-gray-500">Localisation</h3>
              {isEditing ? (
                <div className="mt-1">
                  <ComboboxDemo 
                    onSelect={(city) => setSelectedCity(city)}
                    defaultValue={location}
                  />
                </div>
              ) : (
                <p className="text-lg">{location || 'Non spécifié'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileInfo;
