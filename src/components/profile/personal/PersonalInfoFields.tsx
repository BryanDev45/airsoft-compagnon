
import React, { useState, useEffect } from 'react';
import { User, Calendar, Phone, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ProfileEditableField from '../ProfileEditableField';

interface PersonalInfoFieldsProps {
  profileData: any;
  user: any;
  isOwnProfile: boolean;
  isVerified: boolean;
  updateFirstName: (firstName: string) => Promise<boolean>;
  updateLastName: (lastName: string) => Promise<boolean>;
  updatePhoneNumber: (phoneNumber: string) => Promise<boolean>;
  updateSpokenLanguage: (language: string) => Promise<boolean>;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({
  profileData,
  user,
  isOwnProfile,
  isVerified,
  updateFirstName,
  updateLastName,
  updatePhoneNumber,
  updateSpokenLanguage
}) => {
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingLanguage, setIsEditingLanguage] = useState(false);
  const [isEditingFirstName, setIsEditingFirstName] = useState(false);
  const [isEditingLastName, setIsEditingLastName] = useState(false);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState(profileData?.phone_number || '');
  const [currentSpokenLanguage, setCurrentSpokenLanguage] = useState(profileData?.spoken_language || '');
  const [currentFirstName, setCurrentFirstName] = useState(profileData?.firstname || '');
  const [currentLastName, setCurrentLastName] = useState(profileData?.lastname || '');

  useEffect(() => {
    setCurrentPhoneNumber(profileData?.phone_number || '');
    setCurrentSpokenLanguage(profileData?.spoken_language || '');
    setCurrentFirstName(profileData?.firstname || '');
    setCurrentLastName(profileData?.lastname || '');
  }, [profileData?.phone_number, profileData?.spoken_language, profileData?.firstname, profileData?.lastname]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const handleFirstNameSave = async (value: string) => {
    const success = await updateFirstName(value);
    if (success) {
      setCurrentFirstName(value);
      setIsEditingFirstName(false);
    }
    return success;
  };

  const handleLastNameSave = async (value: string) => {
    const success = await updateLastName(value);
    if (success) {
      setCurrentLastName(value);
      setIsEditingLastName(false);
    }
    return success;
  };

  const handlePhoneSave = async (value: string) => {
    const success = await updatePhoneNumber(value);
    if (success) {
      setCurrentPhoneNumber(value);
      setIsEditingPhone(false);
    }
    return success;
  };

  const handleLanguageSave = async (value: string) => {
    const success = await updateSpokenLanguage(value);
    if (success) {
      setCurrentSpokenLanguage(value);
      setIsEditingLanguage(false);
    }
    return success;
  };

  return (
    <div className="space-y-4">
      {/* Prénom - Modifiable si non vérifié */}
      {isOwnProfile && !isVerified ? (
        <ProfileEditableField
          icon={<User className="h-5 w-5" />}
          label="Prénom"
          value={currentFirstName}
          placeholder="Votre prénom"
          isEditing={isEditingFirstName}
          onEdit={() => setIsEditingFirstName(true)}
          onSave={handleFirstNameSave}
          onCancel={() => setIsEditingFirstName(false)}
          isOwnProfile={isOwnProfile}
        />
      ) : (
        <div className="flex items-start space-x-3">
          <User className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="text-sm text-gray-500 block mb-1">Prénom</span>
            <p className="font-medium">{currentFirstName || 'Non spécifié'}</p>
          </div>
        </div>
      )}

      {/* Nom - Modifiable si non vérifié */}
      {isOwnProfile && !isVerified ? (
        <ProfileEditableField
          icon={<User className="h-5 w-5" />}
          label="Nom"
          value={currentLastName}
          placeholder="Votre nom"
          isEditing={isEditingLastName}
          onEdit={() => setIsEditingLastName(true)}
          onSave={handleLastNameSave}
          onCancel={() => setIsEditingLastName(false)}
          isOwnProfile={isOwnProfile}
        />
      ) : (
        <div className="flex items-start space-x-3">
          <User className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="text-sm text-gray-500 block mb-1">Nom</span>
            <p className="font-medium">{currentLastName || 'Non spécifié'}</p>
          </div>
        </div>
      )}
      
      <div className="flex items-start space-x-3">
        <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <span className="text-sm text-gray-500 block mb-1 text-left">Membre depuis</span>
          <p className="font-medium text-left">{formatDate(profileData?.join_date)}</p>
        </div>
      </div>
      
      {profileData?.age && (
        <div className="flex items-start space-x-3">
          <User className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="text-sm text-gray-500 block mb-1 text-left">Âge</span>
            <p className="font-medium text-left">{profileData.age} ans</p>
          </div>
        </div>
      )}

      <ProfileEditableField
        icon={<Globe className="h-5 w-5" />}
        label="Langue parlée"
        value={currentSpokenLanguage}
        placeholder="Votre langue parlée"
        isEditing={isEditingLanguage}
        onEdit={() => setIsEditingLanguage(true)}
        onSave={handleLanguageSave}
        onCancel={() => setIsEditingLanguage(false)}
        isOwnProfile={isOwnProfile}
      />

      {isOwnProfile && (
        <ProfileEditableField
          icon={<Phone className="h-5 w-5" />}
          label="Numéro de téléphone"
          value={currentPhoneNumber}
          placeholder="Votre numéro de téléphone"
          isEditing={isEditingPhone}
          onEdit={() => setIsEditingPhone(true)}
          onSave={handlePhoneSave}
          onCancel={() => setIsEditingPhone(false)}
          isOwnProfile={isOwnProfile}
          inputType="tel"
        />
      )}
    </div>
  );
};

export default PersonalInfoFields;
