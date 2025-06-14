
import React from 'react';
import { MapPin, Users, Phone, Globe } from 'lucide-react';
import { ComboboxDemo } from './CityCombobox';
import { PersonalInfoEditor } from './PersonalInfoEditor';

interface ProfileInfoProps {
  user: any;
  profileData: any;
  updateLocation: (location: string) => void;
  handleNavigateToTeam: () => void;
  isOwnProfile: boolean;
}

const LANGUAGE_LABELS: { [key: string]: string } = {
  'fr': 'Français',
  'en': 'English',
  'es': 'Español',
  'de': 'Deutsch',
  'it': 'Italiano',
  'pt': 'Português',
  'nl': 'Nederlands',
  'pl': 'Polski',
  'ru': 'Русский',
  'ar': 'العربية',
  'zh': '中文',
  'ja': '日本語',
};

const ProfileInfo: React.FC<ProfileInfoProps> = ({ 
  user, 
  profileData,
  updateLocation, 
  handleNavigateToTeam,
  isOwnProfile
}) => {
  const handleLocationSelect = async (location: string) => {
    await updateLocation(location);
  };

  const handleUpdateProfile = () => {
    // This will be called after the PersonalInfoEditor updates the profile
    // The parent component should refetch the profile data
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-800">Informations du profil</h2>
          <PersonalInfoEditor 
            profileData={profileData}
            onUpdate={handleUpdateProfile}
            isOwnProfile={isOwnProfile}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong className="text-gray-700">Nom d'utilisateur:</strong>
            <p className="text-gray-600">{user?.username || 'Non défini'}</p>
          </div>
          
          <div>
            <strong className="text-gray-700">Email:</strong>
            <p className="text-gray-600">{user?.email || 'Non défini'}</p>
          </div>
          
          <div>
            <strong className="text-gray-700">Prénom:</strong>
            <p className="text-gray-600">{user?.firstname || 'Non défini'}</p>
          </div>
          
          <div>
            <strong className="text-gray-700">Nom:</strong>
            <p className="text-gray-600">{user?.lastname || 'Non défini'}</p>
          </div>
          
          <div>
            <strong className="text-gray-700">Date de naissance:</strong>
            <p className="text-gray-600">{user?.birth_date || 'Non définie'}</p>
          </div>
          
          <div>
            <strong className="text-gray-700">Âge:</strong>
            <p className="text-gray-600">{user?.age ? `${user.age} ans` : 'Non défini'}</p>
          </div>

          {/* Phone number - visible only to own profile */}
          {isOwnProfile && (
            <div>
              <strong className="text-gray-700 flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                Numéro de téléphone:
              </strong>
              <p className="text-gray-600">{profileData?.phone_number || 'Non défini'}</p>
              <p className="text-xs text-muted-foreground">Visible uniquement par vous</p>
            </div>
          )}

          {/* Spoken language - visible to everyone */}
          <div>
            <strong className="text-gray-700 flex items-center">
              <Globe className="w-4 h-4 mr-1" />
              Langue parlée:
            </strong>
            <p className="text-gray-600">
              {profileData?.spoken_language 
                ? LANGUAGE_LABELS[profileData.spoken_language] || profileData.spoken_language
                : 'Non définie'
              }
            </p>
          </div>
          
          <div>
            <strong className="text-gray-700">Date d'inscription:</strong>
            <p className="text-gray-600">{user?.join_date || 'Non définie'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MapPin className="mr-2 text-airsoft-red" />
          Localisation
        </h3>
        <div className="space-y-4">
          <div>
            <strong className="text-gray-700">Ville actuelle:</strong>
            <p className="text-gray-600 mb-2">{user?.location || 'Non définie'}</p>
            {isOwnProfile && (
              <div className="max-w-xs">
                <ComboboxDemo 
                  defaultValue={user?.location || ""} 
                  onSelect={handleLocationSelect}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {user?.team && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="mr-2 text-airsoft-red" />
            Équipe
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <strong className="text-gray-700">Équipe:</strong>
              <p className="text-gray-600">{user.team}</p>
              {user.is_team_leader && (
                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mt-1">
                  Chef d'équipe
                </span>
              )}
            </div>
            <button
              onClick={handleNavigateToTeam}
              className="px-4 py-2 bg-airsoft-red text-white rounded hover:bg-red-700 transition-colors"
            >
              Voir l'équipe
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
