
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BioTab from './BioTab';
import AvatarUploader from './AvatarUploader';
import BannerUploader from './BannerUploader';

interface ProfileEditTabsProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  username: string;
  bio: string;
  avatarPreview: string | null;
  bannerPreview: string | null;
  onUsernameChange: (value: string) => void;
  onBioChange: (value: string) => void;
  onAvatarChange: (avatarUrl: string | null) => void;
  onBannerChange: (bannerUrl: string | null) => void;
}

const ProfileEditTabs: React.FC<ProfileEditTabsProps> = ({
  currentTab,
  onTabChange,
  username,
  bio,
  avatarPreview,
  bannerPreview,
  onUsernameChange,
  onBioChange,
  onAvatarChange,
  onBannerChange
}) => {
  return (
    <Tabs value={currentTab} onValueChange={onTabChange} className="mt-4">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="bio">Informations</TabsTrigger>
        <TabsTrigger value="avatar">Avatar</TabsTrigger>
        <TabsTrigger value="banner">Bannière</TabsTrigger>
      </TabsList>
      
      <TabsContent value="bio" className="space-y-4">
        <BioTab
          username={username}
          bio={bio}
          onUsernameChange={onUsernameChange}
          onBioChange={onBioChange}
        />
      </TabsContent>
      
      <TabsContent value="avatar" className="space-y-4">
        <AvatarUploader 
          avatarPreview={avatarPreview}
          onAvatarChange={onAvatarChange}
        />
      </TabsContent>
      
      <TabsContent value="banner" className="space-y-4">
        <BannerUploader 
          bannerPreview={bannerPreview}
          onBannerChange={onBannerChange}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileEditTabs;
