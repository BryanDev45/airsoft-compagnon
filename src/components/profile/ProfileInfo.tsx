
import React from 'react';
import { Card } from "@/components/ui/card";
import ProfilePersonalInfo from './ProfilePersonalInfo';
import ProfileTeamInfo from './ProfileTeamInfo';
import ProfileLocationInfo from './ProfileLocationInfo';

const ProfileInfo = ({
  user,
  profileData,
  updateLocation,
  handleNavigateToTeam,
  isOwnProfile = false
}) => {
  return (
    <Card className="p-6 shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ProfilePersonalInfo 
            profileData={profileData}
            user={user}
            isOwnProfile={isOwnProfile}
          />
          
          <ProfileLocationInfo
            profileData={profileData}
            isOwnProfile={isOwnProfile}
            updateLocation={updateLocation}
          />
        </div>
        
        <div className="space-y-6">
          <ProfileTeamInfo 
            profileData={profileData}
            isOwnProfile={isOwnProfile}
          />
        </div>
      </div>
    </Card>
  );
};

export default ProfileInfo;
