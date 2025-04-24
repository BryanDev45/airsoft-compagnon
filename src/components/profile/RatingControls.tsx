
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Check } from "lucide-react";
import RatingStars from './RatingStars';
import ReportUserButton from './ReportUserButton';

interface RatingControlsProps {
  currentUserId: string | null;
  userData: any;
  isFollowing: boolean;
  friendRequestSent: boolean;
  userRating: number;
  handleFollowUser: () => Promise<void>;
  handleRatingChange: (rating: number) => Promise<void>;
}

const RatingControls: React.FC<RatingControlsProps> = ({
  currentUserId,
  userData,
  isFollowing,
  friendRequestSent,
  userRating,
  handleFollowUser,
  handleRatingChange
}) => {
  return (
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
        />
      </div>
      
      <ReportUserButton username={userData?.username} />
    </div>
  );
};

export default RatingControls;
