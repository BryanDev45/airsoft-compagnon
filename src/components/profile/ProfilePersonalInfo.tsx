
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
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState(profileData?.phone_number || '');
  const [currentSpokenLanguage, setCurrentSpokenLanguage] = useState(profileData?.spoken_language || '');

  // Synchroniser les états locaux avec les données du profil quand elles changent
  useEffect(() => {
    setCurrentPhoneNumber(profileData?.phone_number || '');
    setCurrentSpokenLanguage(profileData?.spoken_language || '');
  }, [profileData?.phone_number, profileData?.spoken_language]);

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

  const updatePhoneNumber = async (phoneNumber: string) => {
    try {
      console.log('Updating phone number:', phoneNumber, 'for user:', user?.id);
      
      const { error } = await supabase
        .from('profiles')
        .update({ phone_number: phoneNumber })
        .eq('id', user?.id);

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
      
      const { error } = await supabase
        .from('profiles')
        .update({ spoken_language: language })
        .eq('id', user?.id);

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

  return (
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
        
        {profileData?.age && (
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <span className="text-sm text-gray-500">Âge</span>
              <p className="font-medium">{profileData.age} ans</p>
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
          onSave={async (value) => {
            const success = await updateSpokenLanguage(value);
            if (success) setIsEditingLanguage(false);
            return success;
          }}
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
            onSave={async (value) => {
              const success = await updatePhoneNumber(value);
              if (success) setIsEditingPhone(false);
              return success;
            }}
            onCancel={() => setIsEditingPhone(false)}
            isOwnProfile={isOwnProfile}
            inputType="tel"
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePersonalInfo;
