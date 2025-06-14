
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Check, ShieldX } from "lucide-react";
import RatingStars from './RatingStars';
import ReportUserButton from './ReportUserButton';
import ProfileHeader from './ProfileHeader';
import BanUserDialog from './BanUserDialog';
import TeamInviteButton from '../search/TeamInviteButton';

interface UserProfileHeaderProps {
  profileData: any;
  userData: any;
  isFollowing: boolean;
  friendRequestSent: boolean;
  currentUserId: string | null;
  userRating: number;
  userReputation?: number | null;
  handleFollowUser: () => void;
  handleRatingChange: (rating: number) => void;
  isCurrentUserAdmin?: boolean;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  profileData,
  userData,
  isFollowing,
  friendRequestSent,
  currentUserId,
  userRating,
  userReputation,
  handleFollowUser,
  handleRatingChange,
  isCurrentUserAdmin = false
}) => {
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  
  // Mock functions that are called from ProfileHeader
  const toggleProfileSettings = () => {
    // This is just a placeholder for the ProfileHeader component
  };

  const onEditBio = () => {
    // This is just a placeholder for the ProfileHeader component
  };

  // Vérifier si l'utilisateur consulte son propre profil
  const isOwnProfile = currentUserId === userData?.id;

  // Utiliser la réputation mise à jour si disponible, sinon utiliser celle du profil
  // Ne pas afficher la réputation si elle est 0 ou null
  const displayedReputation = userReputation !== null && userReputation > 0 ? userReputation : 
                              (profileData?.reputation && profileData.reputation > 0 ? profileData.reputation : null);

  return (
    <div className="relative">
      <ProfileHeader 
        user={{
          ...profileData, 
          reputation: displayedReputation,
          team_logo: profileData?.team_logo,
          team_name: profileData?.team,
          is_verified: profileData?.is_verified
        }}
        isOwnProfile={isOwnProfile}
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

          {/* Team invitation button - only show if player has no team */}
          {currentUserId && !userData?.team_id && (
            <TeamInviteButton
              targetUserId={userData?.id}
              targetUsername={userData?.username}
            />
          )}
          
          <div className="flex items-center gap-2">
            <RatingStars
              rating={userRating}
              onRatingChange={handleRatingChange}
              readonly={!currentUserId || currentUserId === userData?.id}
              userId={userData?.id}
            />
          </div>
          
          {/* Ban/Unban button for admins */}
          {isCurrentUserAdmin && userData?.id !== currentUserId && (
            <Button
              onClick={() => setBanDialogOpen(true)}
              variant="destructive"
              className={userData?.Ban ? "bg-gray-600" : ""}
            >
              <ShieldX className="mr-2 h-4 w-4" />
              {userData?.Ban ? "Débannir" : "Bannir"}
            </Button>
          )}
          
          <ReportUserButton 
            username={profileData?.username} 
            reportedUserId={userData?.id}
          />
        </div>
      )}

      {/* Ban confirmation dialog */}
      <BanUserDialog
        open={banDialogOpen}
        onOpenChange={setBanDialogOpen}
        userData={userData}
        currentUserId={currentUserId}
        isCurrentUserAdmin={isCurrentUserAdmin}
      />
    </div>
  );
};

export default UserProfileHeader;
