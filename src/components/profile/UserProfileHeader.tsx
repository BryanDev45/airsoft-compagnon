
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Check, ShieldX } from "lucide-react";
import RatingStars from './RatingStars';
import ReportUserButton from './ReportUserButton';
import ProfileHeader from './ProfileHeader';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const displayedReputation = userReputation !== null ? userReputation : profileData?.reputation || 0;

  const handleBanUser = async () => {
    if (!isCurrentUserAdmin || !userData?.id) return;

    try {
      const isBanned = userData.Ban || false;
      
      const { error } = await supabase
        .from('profiles')
        .update({ Ban: !isBanned })
        .eq('id', userData.id);

      if (error) throw error;

      toast({
        title: isBanned ? "Utilisateur débanni" : "Utilisateur banni",
        description: isBanned 
          ? `${userData.username} a été débanni avec succès` 
          : `${userData.username} a été banni avec succès`,
        variant: isBanned ? "default" : "destructive",
      });
      
      // Refresh page to see changes
      window.location.reload();
      
    } catch (error) {
      console.error("Error banning user:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la tentative de bannissement",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative">
      <ProfileHeader 
        user={{...profileData, reputation: displayedReputation}}
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
              onClick={handleBanUser}
              variant="destructive"
              className={userData?.Ban ? "bg-gray-600" : ""}
            >
              <ShieldX className="mr-2 h-4 w-4" />
              {userData?.Ban ? "Débannir" : "Bannir"}
            </Button>
          )}
          
          <ReportUserButton username={profileData?.username} />
        </div>
      )}
    </div>
  );
};

export default UserProfileHeader;
