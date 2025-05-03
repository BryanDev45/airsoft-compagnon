
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { callRPC } from '@/utils/supabaseHelpers';

/**
 * Hook for handling social interactions with a user profile
 */
export const useUserSocial = (userData: any, currentUserId: string | null) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState(false);

  // Check friendship status and rating when userData or currentUserId changes
  useEffect(() => {
    const checkSocialStatus = async () => {
      if (!userData?.id || !currentUserId) return;
      
      try {
        const { data: friendship, error: friendshipError } = await supabase
          .from('friendships')
          .select('*')
          .eq('user_id', currentUserId)
          .eq('friend_id', userData.id)
          .single();
          
        if (!friendshipError && friendship) {
          setIsFollowing(friendship.status === 'accepted');
          setFriendRequestSent(friendship.status === 'pending');
        }
        
        // Call RPC function
        const { data: ratings, error: ratingsError } = await callRPC<number>('get_user_rating', { 
          p_rater_id: currentUserId, 
          p_rated_id: userData.id 
        });
          
        if (!ratingsError && ratings !== null) {
          setUserRating(ratings);
          setHasRated(true);
        }
      } catch (error) {
        console.error("Error checking social status:", error);
      }
    };
    
    checkSocialStatus();
  }, [userData?.id, currentUserId]);

  const handleFollowUser = async () => {
    if (!currentUserId) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour ajouter un ami",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFollowing) {
        const { error } = await supabase
          .from('friendships')
          .delete()
          .or(`and(user_id.eq.${currentUserId},friend_id.eq.${userData.id}),and(user_id.eq.${userData.id},friend_id.eq.${currentUserId})`);

        if (error) throw error;

        setIsFollowing(false);
        setFriendRequestSent(false);
        toast({
          title: "Ami retiré",
          description: "Cet utilisateur a été retiré de vos amis",
        });
      } else if (friendRequestSent) {
        const { error } = await supabase
          .from('friendships')
          .delete()
          .eq('user_id', currentUserId)
          .eq('friend_id', userData.id);

        if (error) throw error;

        setFriendRequestSent(false);
        toast({
          title: "Demande annulée",
          description: "Votre demande d'amitié a été annulée",
        });
      } else {
        const { error } = await supabase
          .from('friendships')
          .insert({
            user_id: currentUserId,
            friend_id: userData.id,
            status: 'pending'
          });

        if (error) throw error;

        setFriendRequestSent(true);
        toast({
          title: "Demande envoyée",
          description: "Votre demande d'amitié a été envoyée",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la gestion de l'amitié:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'action",
        variant: "destructive",
      });
    }
  };

  const handleRatingChange = async (rating: number) => {
    if (!currentUserId) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour noter un utilisateur",
        variant: "destructive",
      });
      return;
    }

    try {
      if (hasRated) {
        const { error } = await callRPC('update_user_rating', { 
          p_rater_id: currentUserId, 
          p_rated_id: userData.id, 
          p_rating: rating 
        });
          
        if (error) throw error;
      } else {
        const { error } = await callRPC('insert_user_rating', { 
          p_rater_id: currentUserId, 
          p_rated_id: userData.id, 
          p_rating: rating 
        });
          
        if (error) throw error;
        setHasRated(true);
      }

      setUserRating(rating);
      
      // Update average reputation
      const { data: avgRating, error: avgError } = await callRPC<number>('get_average_rating', 
        { p_user_id: userData.id }
      );
      
      if (!avgError && avgRating !== null) {
        // This will be visible in the UI but we can't directly update profileData here
        // This is fine since the updated value will be fetched on the next load
      }
      
      toast({
        title: "Notation enregistrée",
        description: "Votre évaluation a été prise en compte",
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la notation:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre évaluation",
        variant: "destructive",
      });
    }
  };

  return {
    isFollowing,
    friendRequestSent,
    userRating,
    handleFollowUser,
    handleRatingChange
  };
};
