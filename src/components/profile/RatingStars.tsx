
import React, { useState, useEffect } from 'react';
import { Star, StarHalf, StarOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

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
  
  useEffect(() => {
    // Get current user's ID
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
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
      
      // Check if rating already exists
      const { data: existingRating } = await supabase
        .from('user_ratings')
        .select('*')
        .eq('rater_id', currentUserId)
        .eq('rated_id', userId)
        .maybeSingle();
      
      let result;
      
      if (existingRating) {
        // Update existing rating
        result = await supabase
          .from('user_ratings')
          .update({ rating: newRating, updated_at: new Date() })
          .eq('rater_id', currentUserId)
          .eq('rated_id', userId);
      } else {
        // Create new rating
        result = await supabase
          .from('user_ratings')
          .insert([{ 
            rater_id: currentUserId, 
            rated_id: userId, 
            rating: newRating 
          }]);
      }
      
      if (result.error) throw result.error;
      
      // Update UI
      setCurrentRating(newRating);
      
      // Call callback if provided
      if (onRatingChange) {
        onRatingChange(newRating);
      }
      
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

  const calculateStars = () => {
    const stars = [];
    const fullStars = Math.floor(currentRating);
    const hasHalfStar = currentRating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star
            key={i}
            className={`text-yellow-400 ${!readonly && !isSaving && 'cursor-pointer hover:scale-110 transition-transform'}`}
            size={size}
            onClick={() => !readonly && !isSaving && handleRatingClick(i)}
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <StarHalf
            key={i}
            className={`text-yellow-400 ${!readonly && !isSaving && 'cursor-pointer hover:scale-110 transition-transform'}`}
            size={size}
            onClick={() => !readonly && !isSaving && handleRatingClick(i - 0.5)}
          />
        );
      } else {
        stars.push(
          <StarOff
            key={i}
            className={`text-gray-300 ${!readonly && !isSaving && 'cursor-pointer hover:scale-110 transition-transform'}`}
            size={size}
            onClick={() => !readonly && !isSaving && handleRatingClick(i)}
          />
        );
      }
    }
    return stars;
  };

  return (
    <div className="flex gap-1">
      {calculateStars()}
      {isSaving && (
        <span className="text-xs text-gray-500 ml-2 animate-pulse">Enregistrement...</span>
      )}
    </div>
  );
};

export default RatingStars;
