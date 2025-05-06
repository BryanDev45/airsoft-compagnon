
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, ChevronRight } from 'lucide-react';
import type { Profile } from "@/types/profile";

interface GameDetailsTabProps {
  description: string;
  scenarios: string[];
  creator: Profile | null | undefined;
  creatorRating: number | null;
  navigateToCreatorProfile: () => void;
}

const GameDetailsTab: React.FC<GameDetailsTabProps> = ({
  description,
  scenarios,
  creator,
  creatorRating,
  navigateToCreatorProfile
}) => {
  // Helper function to get initials from username
  const getInitials = (username: string | null): string => {
    if (!username) return '??';
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Description</h2>
      <p className="text-gray-700 mb-6">{description}</p>
      
      <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
        {scenarios.map((scenario, idx) => (
          <li key={idx}>{scenario}</li>
        ))}
      </ul>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Organisé par</h3>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage 
              src={creator?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} 
              alt={creator?.username || "Organisateur"} 
            />
            <AvatarFallback>{getInitials(creator?.username)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{creator?.username || "Organisateur"}</div>
            <div className="flex items-center text-sm text-gray-600">
              <Star size={14} className="text-yellow-500 mr-1" />
              <span>{creatorRating ? creatorRating.toFixed(1) : '0'} / 5</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto" 
            onClick={navigateToCreatorProfile}
          >
            Voir le profil <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default GameDetailsTab;
