
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Save, X, Edit } from 'lucide-react';
import { ComboboxDemo as CityCombobox } from './CityCombobox';

interface ProfileLocationInfoProps {
  profileData: any;
  isOwnProfile: boolean;
  updateLocation: (location: string) => Promise<boolean>;
}

const ProfileLocationInfo: React.FC<ProfileLocationInfoProps> = ({
  profileData,
  isOwnProfile,
  updateLocation
}) => {
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationValue, setLocationValue] = useState(profileData?.location || '');

  const handleLocationUpdate = async () => {
    if (updateLocation) {
      const success = await updateLocation(locationValue);
      if (success) {
        setIsEditingLocation(false);
      }
    }
  };

  const handleLocationSelect = (value: string) => {
    setLocationValue(value);
  };

  return (
    <div className="flex items-start space-x-3">
      <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <span className="text-sm text-gray-500 block mb-1 text-left">Localisation</span>
        {isOwnProfile && isEditingLocation ? (
          <div className="mt-1 space-y-2">
            <CityCombobox defaultValue={locationValue} onSelect={handleLocationSelect} />
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleLocationUpdate}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
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
            {isOwnProfile && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditingLocation(true)} 
                className="ml-2 p-1 flex-shrink-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileLocationInfo;
