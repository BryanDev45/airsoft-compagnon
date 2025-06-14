
import React from 'react';
import { Star, UserPlus, MessageCircle, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RatingStars from './RatingStars';
import ReportUserButton from './ReportUserButton';
import BanUserDialog from './BanUserDialog';
import { Profile } from '@/types/profile';

interface UserProfileHeaderProps {
  profileData: Profile | null;
  userData: any;
  isFollowing: boolean;
  friendRequestSent: boolean;
  currentUserId: string | null;
  userRating: number;
  userReputation: number;
  handleFollowUser: () => void;
  handleRatingChange: (rating: number) => void;
  isCurrentUserAdmin: boolean;
}

const UserProfileHeader = ({
  profileData,
  userData,
  isFollowing,
  friendRequestSent,
  currentUserId,
  userRating,
  userReputation,
  handleFollowUser,
  handleRatingChange,
  isCurrentUserAdmin
}: UserProfileHeaderProps) => {
  const isOwnProfile = currentUserId === userData?.id;
  const [showBanDialog, setShowBanDialog] = React.useState(false);

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={profileData?.avatar || "/placeholder.svg"}
            alt={`Avatar de ${profileData?.username}`}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              {profileData?.username}
              {profileData?.is_verified && (
                <span className="text-blue-500 text-sm">✓ Vérifié</span>
              )}
            </h1>
            <p className="text-gray-600">
              {profileData?.firstname} {profileData?.lastname}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <RatingStars
                rating={userReputation}
                onRatingChange={!isOwnProfile ? handleRatingChange : undefined}
                userId={userData?.id}
                readonly={isOwnProfile}
              />
              <span className="text-sm text-gray-500">
                ({userReputation?.toFixed(1) || '0.0'})
              </span>
            </div>
          </div>
        </div>

        {!isOwnProfile && currentUserId && (
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleFollowUser}
              variant={isFollowing ? "secondary" : "default"}
              className="flex items-center space-x-2"
              disabled={friendRequestSent}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Ami</span>
                </>
              ) : friendRequestSent ? (
                <>
                  <UserX className="w-4 h-4" />
                  <span>Demande envoyée</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Ajouter en ami</span>
                </>
              )}
            </Button>

            <Button variant="outline" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Message</span>
            </Button>

            <ReportUserButton 
              username={profileData?.username || 'Utilisateur'} 
              reportedUserId={userData?.id}
            />

            {isCurrentUserAdmin && (
              <>
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowBanDialog(true)}
                >
                  {profileData?.Ban ? 'Débannir' : 'Bannir'}
                </Button>
                
                <BanUserDialog
                  open={showBanDialog}
                  onOpenChange={setShowBanDialog}
                  userData={userData}
                  currentUserId={currentUserId}
                  isCurrentUserAdmin={isCurrentUserAdmin}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileHeader;
