
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Check } from "lucide-react";
import RatingStars from './RatingStars';
import ReportUserButton from './ReportUserButton';
import ProfileHeader from './ProfileHeader';

interface UserProfileHeaderProps {
  profileData: any;
  userData: any;
  isFollowing: boolean;
  friendRequestSent: boolean;
  currentUserId: string | null;
  userRating: number;
  handleFollowUser: () => void;
  handleRatingChange: (rating: number) => void;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  profileData,
  userData,
  isFollowing,
  friendRequestSent,
  currentUserId,
  userRating,
  handleFollowUser,
  handleRatingChange
}) => {
  // Mock functions that are called from ProfileHeader
  const setEditing = () => {
    // This is just a placeholder for the ProfileHeader component
  };

  const toggleProfileSettings = () => {
    // This is just a placeholder for the ProfileHeader component
  };

  const onEditBio = () => {
    // This is just a placeholder for the ProfileHeader component
  };

  // Vérifier si l'utilisateur consulte son propre profil
  const isOwnProfile = currentUserId === userData?.id;

  return (
    <div className="relative">
      <ProfileHeader 
        user={profileData} 
        isOwnProfile={isOwnProfile}
        setEditing={setEditing}
        toggleProfileSettings={toggleProfileSettings}
        onEditBio={onEditBio}
      />
      
      {!isOwnProfile && (
        <div className="absolute top-4 right-4 flex space-x-2">
          {currentUserId && currentUserId !== userData?.id && (
            <Button 
              onClick={handleFollowUser}
              variant={isFollowing || friendRequestSent ? "outline" : "default"}
              className={isFollowing || friendRequestSent ? "bg-white text-black border-gray-300" : "bg-airsoft-red text-white"}
            >
              {isFollowing ? (
                <>
                  <UserMinus className="mr-2 h-4 w-4" />
                  Retirer des amis
                </>
              ) : friendRequestSent ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Demande envoyée
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Ajouter en ami
                </>
              )}
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            <RatingStars
              rating={userRating}
              onRatingChange={handleRatingChange}
              readonly={!currentUserId || currentUserId === userData?.id}
              userId={userData?.id}
            />
          </div>
          
          <ReportUserButton username={profileData?.username} />
        </div>
      )}
    </div>
  );
};

export default UserProfileHeader;
