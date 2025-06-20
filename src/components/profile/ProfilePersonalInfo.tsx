import React, { useState, useEffect } from 'react';
import { User, Calendar, Phone, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ProfileEditableField from './ProfileEditableField';
interface ProfilePersonalInfoProps {
  profileData: any;
  user: any;
  isOwnProfile: boolean;
}
const ProfilePersonalInfo: React.FC<ProfilePersonalInfoProps> = ({
  profileData,
  user,
  isOwnProfile
}) => {
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingLanguage, setIsEditingLanguage] = useState(false);
  const [isEditingFirstName, setIsEditingFirstName] = useState(false);
  const [isEditingLastName, setIsEditingLastName] = useState(false);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState(profileData?.phone_number || '');
  const [currentSpokenLanguage, setCurrentSpokenLanguage] = useState(profileData?.spoken_language || '');
  const [currentFirstName, setCurrentFirstName] = useState(profileData?.firstname || '');
  const [currentLastName, setCurrentLastName] = useState(profileData?.lastname || '');

  // Vérifier si le profil est vérifié
  const isVerified = profileData?.is_verified === true;

  // Synchroniser les états locaux avec les données du profil quand elles changent
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
      return format(date, 'dd MMMM yyyy', {
        locale: fr
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };
  const updateFirstName = async (firstName: string) => {
    try {
      console.log('Updating first name:', firstName, 'for user:', user?.id);
      const {
        error
      } = await supabase.from('profiles').update({
        firstname: firstName
      }).eq('id', user?.id);
      if (error) {
        console.error('Supabase error updating first name:', error);
        throw error;
      }
      console.log('First name updated successfully');
      setCurrentFirstName(firstName);
      toast({
        title: "Succès",
        description: "Prénom mis à jour"
      });
      return true;
    } catch (error) {
      console.error('Error updating first name:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le prénom",
        variant: "destructive"
      });
      return false;
    }
  };
  const updateLastName = async (lastName: string) => {
    try {
      console.log('Updating last name:', lastName, 'for user:', user?.id);
      const {
        error
      } = await supabase.from('profiles').update({
        lastname: lastName
      }).eq('id', user?.id);
      if (error) {
        console.error('Supabase error updating last name:', error);
        throw error;
      }
      console.log('Last name updated successfully');
      setCurrentLastName(lastName);
      toast({
        title: "Succès",
        description: "Nom mis à jour"
      });
      return true;
    } catch (error) {
      console.error('Error updating last name:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le nom",
        variant: "destructive"
      });
      return false;
    }
  };
  const updatePhoneNumber = async (phoneNumber: string) => {
    try {
      console.log('Updating phone number:', phoneNumber, 'for user:', user?.id);
      const {
        error
      } = await supabase.from('profiles').update({
        phone_number: phoneNumber
      }).eq('id', user?.id);
      if (error) {
        console.error('Supabase error updating phone:', error);
        throw error;
      }
      console.log('Phone number updated successfully');
      setCurrentPhoneNumber(phoneNumber);
      toast({
        title: "Succès",
        description: "Numéro de téléphone mis à jour"
      });
      return true;
    } catch (error) {
      console.error('Error updating phone number:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le numéro de téléphone",
        variant: "destructive"
      });
      return false;
    }
  };
  const updateSpokenLanguage = async (language: string) => {
    try {
      console.log('Updating spoken language:', language, 'for user:', user?.id);
      const {
        error
      } = await supabase.from('profiles').update({
        spoken_language: language
      }).eq('id', user?.id);
      if (error) {
        console.error('Supabase error updating language:', error);
        throw error;
      }
      console.log('Spoken language updated successfully');
      setCurrentSpokenLanguage(language);
      toast({
        title: "Succès",
        description: "Langue parlée mise à jour"
      });
      return true;
    } catch (error) {
      console.error('Error updating spoken language:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la langue parlée",
        variant: "destructive"
      });
      return false;
    }
  };
  return <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
      
      <div className="space-y-4">
        {/* Prénom - Modifiable si non vérifié */}
        {isOwnProfile && !isVerified ? <ProfileEditableField icon={<User className="h-5 w-5" />} label="Prénom" value={currentFirstName} placeholder="Votre prénom" isEditing={isEditingFirstName} onEdit={() => setIsEditingFirstName(true)} onSave={async value => {
        const success = await updateFirstName(value);
        if (success) setIsEditingFirstName(false);
        return success;
      }} onCancel={() => setIsEditingFirstName(false)} isOwnProfile={isOwnProfile} /> : <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="text-sm text-gray-500 block mb-1">Prénom</span>
              <p className="font-medium">{currentFirstName || 'Non spécifié'}</p>
            </div>
          </div>}

        {/* Nom - Modifiable si non vérifié */}
        {isOwnProfile && !isVerified ? <ProfileEditableField icon={<User className="h-5 w-5" />} label="Nom" value={currentLastName} placeholder="Votre nom" isEditing={isEditingLastName} onEdit={() => setIsEditingLastName(true)} onSave={async value => {
        const success = await updateLastName(value);
        if (success) setIsEditingLastName(false);
        return success;
      }} onCancel={() => setIsEditingLastName(false)} isOwnProfile={isOwnProfile} /> : <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="text-sm text-gray-500 block mb-1">Nom</span>
              <p className="font-medium">{currentLastName || 'Non spécifié'}</p>
            </div>
          </div>}
        
        <div className="flex items-start space-x-3">
          <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="text-sm text-gray-500 block mb-1 text-left">Membre depuis</span>
            <p className="font-medium text-left">{formatDate(profileData?.join_date)}</p>
          </div>
        </div>
        
        {profileData?.age && <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="text-sm text-gray-500 block mb-1 text-left">Âge</span>
              <p className="font-medium text-left">{profileData.age} ans</p>
            </div>
          </div>}

        <ProfileEditableField icon={<Globe className="h-5 w-5" />} label="Langue parlée" value={currentSpokenLanguage} placeholder="Votre langue parlée" isEditing={isEditingLanguage} onEdit={() => setIsEditingLanguage(true)} onSave={async value => {
        const success = await updateSpokenLanguage(value);
        if (success) setIsEditingLanguage(false);
        return success;
      }} onCancel={() => setIsEditingLanguage(false)} isOwnProfile={isOwnProfile} />

        {isOwnProfile && <ProfileEditableField icon={<Phone className="h-5 w-5" />} label="Numéro de téléphone" value={currentPhoneNumber} placeholder="Votre numéro de téléphone" isEditing={isEditingPhone} onEdit={() => setIsEditingPhone(true)} onSave={async value => {
        const success = await updatePhoneNumber(value);
        if (success) setIsEditingPhone(false);
        return success;
      }} onCancel={() => setIsEditingPhone(false)} isOwnProfile={isOwnProfile} inputType="tel" />}

        {isVerified && isOwnProfile && <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              <span className="font-medium">Profil vérifié :</span> Le nom et prénom ne peuvent plus être modifiés car votre compte est vérifié.
            </p>
          </div>}
      </div>
    </div>;
};
export default ProfilePersonalInfo;