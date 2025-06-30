
import React, { useState, useEffect } from 'react';
import { Star, StarHalf, StarOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { callRPC } from '@/utils/supabaseHelpers';

interface TeamRatingStarsProps {
  teamId: string;
  currentRating?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
}

const TeamRatingStars: React.FC<TeamRatingStarsProps> = ({ 
  teamId,
  currentRating = 0,
  onRatingChange, 
  readonly = false,
  size = 20
}) => {
  const [rating, setRating] = useState<number>(currentRating);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  useEffect(() => {
    // Get current user's ID and their existing rating
    const fetchUserData = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentUserId(data.user.id);
        
        // Get user's existing rating for this team
        const { data: existingRating, error } = await callRPC<number>('get_team_user_rating', {
          p_rater_id: data.user.id,
          p_team_id: teamId
        });
        
        if (!error && existingRating !== null) {
          setUserRating(existingRating);
        }
      }
    };
    
    fetchUserData();
  }, [teamId]);
  
  useEffect(() => {
    setRating(currentRating);
  }, [currentRating]);

  const handleRatingClick = async (newRating: number) => {
    if (readonly || !currentUserId) return;
    
    try {
      setIsSaving(true);
      
      let result;
      
      if (userRating !== null) {
        // Update existing rating
        result = await callRPC('update_team_rating', {
          p_rater_id: currentUserId,
          p_team_id: teamId,
          p_rating: newRating
        });
      } else {
        // Create new rating
        result = await callRPC('insert_team_rating', {
          p_rater_id: currentUserId,
          p_team_id: teamId,
          p_rating: newRating
        });
      }
      
      if (result.error) throw result.error;
      
      // Update local state
      setUserRating(newRating);
      
      // Call callback if provided
      if (onRatingChange) {
        onRatingChange(newRating);
      }
      
      toast({
        title: "Évaluation enregistrée",
        description: "Votre évaluation de l'équipe a été enregistrée avec succès"
      });
      
    } catch (error) {
      console.error("Error saving team rating:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de l'évaluation",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly && !isSaving) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  const displayRating = hoverRating !== null ? hoverRating : (userRating !== null ? userRating : rating);

  const calculateStars = () => {
    const stars = [];
    const fullStars = Math.floor(displayRating);
    const hasHalfStar = displayRating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star
            key={i}
            className={`text-yellow-400 fill-current ${!readonly && !isSaving && 'cursor-pointer hover:scale-110 transition-transform'}`}
            size={size}
            onClick={() => !readonly && !isSaving && handleRatingClick(i)}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <StarHalf
            key={i}
            className={`text-yellow-400 fill-current ${!readonly && !isSaving && 'cursor-pointer hover:scale-110 transition-transform'}`}
            size={size}
            onClick={() => !readonly && !isSaving && handleRatingClick(i - 0.5)}
            onMouseEnter={() => handleMouseEnter(i - 0.5)}
            onMouseLeave={handleMouseLeave}
          />
        );
      } else {
        stars.push(
          <StarOff
            key={i}
            className={`text-gray-300 ${!readonly && !isSaving && 'cursor-pointer hover:text-yellow-400 hover:scale-110 transition-all'}`}
            size={size}
            onClick={() => !readonly && !isSaving && handleRatingClick(i)}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
          />
        );
      }
    }
    return stars;
  };

  return (
    <div className="flex gap-1 items-center">
      {calculateStars()}
      {userRating !== null && !readonly && (
        <span className="text-xs text-gray-600 ml-2">
          Votre note: {userRating}/5
        </span>
      )}
      {isSaving && (
        <span className="text-xs text-gray-500 ml-2 animate-pulse">Enregistrement...</span>
      )}
    </div>
  );
};

export default TeamRatingStars;
