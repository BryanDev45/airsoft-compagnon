
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Star, Edit, Save, X } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const ProfileInfo = ({ user, profileData, updateLocation, handleNavigateToTeam }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newLocation, setNewLocation] = useState(profileData?.location || '');

  const handleSave = async () => {
    await updateLocation(newLocation);
    setIsEditing(false);
  };

  const handleLeaveTeam = () => {
    if (confirm("Êtes-vous sûr de vouloir quitter l'équipe ?")) {
      toast({
        title: "Équipe quittée",
        description: "Vous avez quitté l'équipe avec succès"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          {profileData?.team && (
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-700">Équipe:</span>
                <Button 
                  variant="link" 
                  className="p-0 h-auto hover:text-airsoft-red"
                  onClick={handleNavigateToTeam}
                >
                  {profileData.team}
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={handleLeaveTeam}
                title="Quitter l'équipe"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Informations personnelles</h2>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center"
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-500">Nom</span>
                <p className="text-gray-900">{profileData?.lastname || '-'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-500">Prénom</span>
                <p className="text-gray-900">{profileData?.firstname || '-'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-500">Âge</span>
                <p className="text-gray-900">{profileData?.age || '-'} ans</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-500">Localisation</span>
                {isEditing ? (
                  <Input
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Entrez votre localisation"
                  />
                ) : (
                  <p className="text-gray-900">{profileData?.location || '-'}</p>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-500">Date de création du compte</span>
                <p className="text-gray-900">{new Date(profileData?.join_date).toLocaleDateString('fr-FR') || '-'}</p>
              </div>
              {profileData?.rating && (
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-500">Note moyenne</span>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`h-5 w-5 ${
                          index < Math.floor(profileData.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-gray-600">({profileData.rating}/5)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileInfo;
