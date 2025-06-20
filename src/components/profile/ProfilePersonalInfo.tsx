
import React from 'react';
import PersonalInfoHeader from './personal/PersonalInfoHeader';
import PersonalInfoFields from './personal/PersonalInfoFields';
import VerificationNotice from './personal/VerificationNotice';
import { usePersonalInfoActions } from '@/hooks/profile/usePersonalInfoActions';

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
  const isVerified = profileData?.is_verified === true;
  const actions = usePersonalInfoActions({ user });

  return (
    <div className="space-y-6">
      <PersonalInfoHeader />
      
      <div className="space-y-4">
        <PersonalInfoFields
          profileData={profileData}
          user={user}
          isOwnProfile={isOwnProfile}
          isVerified={isVerified}
          updateFirstName={actions.updateFirstName}
          updateLastName={actions.updateLastName}
          updatePhoneNumber={actions.updatePhoneNumber}
          updateSpokenLanguage={actions.updateSpokenLanguage}
        />

        <VerificationNotice 
          isVerified={isVerified} 
          isOwnProfile={isOwnProfile} 
        />
      </div>
    </div>
  );
};

export default ProfilePersonalInfo;
