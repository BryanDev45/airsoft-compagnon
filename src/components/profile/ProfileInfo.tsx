import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MapPin, Calendar, User, Users, Building2, Award, Edit, X } from 'lucide-react';
import CitySearchApi from './CitySearchApi';

const ProfileInfo = ({
  user,
  profileData,
  updateLocation,
  handleNavigateToTeam
}) => {
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const navigate = useNavigate();
  
  const formatDate = dateString => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy', {
        locale: fr
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };
  
  const handleLocationUpdate = async location => {
    if (updateLocation) {
      const success = await updateLocation(location);
      if (success) {
        setIsEditingLocation(false);
      }
    }
  };
  
  const handleTeamSearch = () => {
    navigate('/search?tab=teams');
  };
  
  return <Card className="p-6 shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <span className="text-sm text-gray-500">Nom complet</span>
                <p className="font-medium">
                  {profileData?.firstname || ''} {profileData?.lastname || ''}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <span className="text-sm text-gray-500">Membre depuis</span>
                <p className="font-medium">{formatDate(profileData?.join_date)}</p>
              </div>
            </div>
            
            {profileData?.age && <div className="flex items-center">
                <User className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <span className="text-sm text-gray-500">Âge</span>
                  <p className="font-medium">{profileData.age} ans</p>
                </div>
              </div>}
            
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-1" />
              <div className="flex-1">
                <span className="text-sm text-gray-500">Localisation</span>
                {isEditingLocation ? (
                  <div className="mt-1 space-y-2">
                    <CitySearchApi
                      defaultValue={profileData?.location || ''}
                      onSelect={handleLocationUpdate}
                    />
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setIsEditingLocation(false)}>
                        <X className="h-4 w-4 mr-2" />
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {profileData?.location || 'Non spécifié'}
                    </p>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingLocation(true)} className="h-8 px-2">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Équipe</h2>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <Users className="h-5 w-5 text-gray-500 mr-3 mt-1" />
              <div className="flex-grow">
                <span className="text-sm text-gray-500">Équipe</span>
                {profileData?.team ? (
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{profileData.team}</p>
                    <Button variant="ghost" size="sm" onClick={handleNavigateToTeam} className="h-8 px-2">
                      <Users className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Aucune équipe</p>
                    <Button variant="ghost" size="sm" onClick={handleTeamSearch} className="h-8 px-2">
                      <Users className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {profileData?.is_team_leader && <div className="flex items-center">
                <Award className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <span className="text-sm text-gray-500">Statut d'équipe</span>
                  <p className="font-medium">Chef d'équipe</p>
                </div>
              </div>}
            
            {profileData?.association && <div className="flex items-center">
                <Building2 className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <span className="text-sm text-gray-500">Association</span>
                  <p className="font-medium">{profileData.association}</p>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </Card>;
};

export default ProfileInfo;
