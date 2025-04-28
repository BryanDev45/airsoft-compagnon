
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

/**
 * Helper function to call Supabase RPC functions with type safety bypassing
 */
const callRPC = async <T,>(functionName: string, params: Record<string, any> = {}): Promise<{data: T | null, error: Error | null}> => {
  try {
    // @ts-ignore - We're intentionally bypassing TypeScript's type checking here
    const result = await supabase.rpc(functionName, params);
    return result;
  } catch (error) {
    console.error(`Error calling RPC function ${functionName}:`, error);
    return { data: null, error: error as Error };
  }
};

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
      const { data: existingRatings, error: checkError } = await supabase
        .from('user_ratings')
        .select('rating')
        .eq('rater_id', currentUserId)
        .eq('rated_id', userId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      let result;
      
      if (existingRatings) {
        // Update existing rating
        result = await supabase
          .from('user_ratings')
          .update({ 
            rating: newRating,
            updated_at: new Date().toISOString()
          })
          .eq('rater_id', currentUserId)
          .eq('rated_id', userId);
      } else {
        // Create new rating
        result = await supabase
          .from('user_ratings')
          .insert({
            rater_id: currentUserId,
            rated_id: userId,
            rating: newRating
          });
      }
      
      if (result.error) throw result.error;
      
      // Update UI
      setCurrentRating(newRating);
      
      // Call callback if provided
      if (onRatingChange) {
        onRatingChange(newRating);
      }
      
      // Update user reputation in profiles
      await updateUserReputation(userId);
      
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

  // Function to update user's reputation (average rating)
  const updateUserReputation = async (ratedUserId: string) => {
    try {
      // Calculate average rating
      const { data: ratings, error } = await supabase
        .from('user_ratings')
        .select('rating')
        .eq('rated_id', ratedUserId);
        
      if (error) throw error;
      
      if (ratings && ratings.length > 0) {
        const totalRating = ratings.reduce((sum, item) => sum + Number(item.rating), 0);
        const avgRating = totalRating / ratings.length;
        
        // Update profile reputation
        await supabase
          .from('profiles')
          .update({ reputation: avgRating })
          .eq('id', ratedUserId);
      }
    } catch (error) {
      console.error("Error updating reputation:", error);
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
