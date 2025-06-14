
import React, { useState, useEffect } from 'react';
import { Star, StarHalf, StarOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { callRPC } from '@/utils/supabaseHelpers';

interface RatingStarsProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
  userId?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({ 
  rating, 
  onRatingChange, 
  readonly = false,
  size = 24,
  userId
}) => {
  const [currentRating, setCurrentRating] = useState<number>(rating);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  useEffect(() => {
    // Get current user's ID
    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentUserId(data.user.id);
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  useEffect(() => {
    // Update local state when prop changes
    setCurrentRating(rating);
  }, [rating]);

  const handleRatingClick = async (newRating: number) => {
    if (readonly || !userId || !currentUserId) return;
    
    // Don't allow rating yourself
    if (userId === currentUserId) {
      toast({
        title: "Action non autorisée",
        description: "Vous ne pouvez pas vous noter vous-même",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Check if rating already exists using the custom function
      const { data: existingRating, error: checkError } = await callRPC<number>('get_user_rating', {
        p_rater_id: currentUserId,
        p_rated_id: userId
      });
      
      if (checkError) throw checkError;
      
      let result;
      
      if (existingRating !== null) {
        // Update existing rating with custom function
        result = await callRPC('update_user_rating', {
          p_rater_id: currentUserId,
          p_rated_id: userId,
          p_rating: newRating
        });
      } else {
        // Create new rating with custom function
        result = await callRPC('insert_user_rating', {
          p_rater_id: currentUserId,
          p_rated_id: userId,
          p_rating: newRating
        });
      }
      
      if (result.error) throw result.error;
      
      // Update UI
      setCurrentRating(newRating);
      
      // Call callback if provided
      if (onRatingChange) {
        onRatingChange(newRating);
      }
      
      // Update the user's reputation by calculating average
      const { data: avgRating, error: avgError } = await callRPC<number>('get_average_rating', { 
        p_user_id: userId 
      });
      
      if (avgError) throw avgError;
      
      toast({
        title: "Évaluation enregistrée",
        description: "Votre évaluation a été enregistrée avec succès"
      });
      
    } catch (error) {
      console.error("Error saving rating:", error);
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

  // Si readonly et aucune note, afficher "non noté"
  if (readonly && currentRating === 0) {
    return (
      <div className="flex items-center">
        <span className="text-sm text-gray-500 italic">non noté</span>
      </div>
    );
  }

  const calculateStars = () => {
    const stars = [];
    const ratingToUse = hoverRating !== null ? hoverRating : currentRating;
    const fullStars = Math.floor(ratingToUse);
    const hasHalfStar = ratingToUse % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star
            key={i}
            className={`text-yellow-400 ${!readonly && !isSaving && 'cursor-pointer hover:scale-110 transition-transform'}`}
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
            className={`text-yellow-400 ${!readonly && !isSaving && 'cursor-pointer hover:scale-110 transition-transform'}`}
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
            className={`text-gray-300 ${!readonly && !isSaving && 'cursor-pointer hover:scale-110 transition-transform'}`}
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
      {isSaving && (
        <span className="text-xs text-gray-500 ml-2 animate-pulse">Enregistrement...</span>
      )}
    </div>
  );
};

export default RatingStars;
