
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { getStorageWithExpiry, setStorageWithExpiry, CACHE_DURATIONS, generateCacheKey, clearCacheItem } from '@/utils/cacheUtils';

/**
 * Hook for handling social interactions between users with caching
 */
export const useUserSocial = (userData: any, currentUserId: string | null) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [userReputation, setUserReputation] = useState<number | null>(null);

  // Load social data when component mounts or user changes
  useEffect(() => {
    if (!userData?.id || !currentUserId) return;

    const checkFriendshipStatus = async () => {
      const friendshipCacheKey = generateCacheKey('friendship_status', { 
        userId: currentUserId, 
        friendId: userData.id 
      });
      
      // Try to get cached friendship status
      const cachedStatus = getStorageWithExpiry(friendshipCacheKey);
      if (cachedStatus !== null) {
        const { isFollowing: cachedIsFollowing, friendRequestSent: cachedRequestSent } = cachedStatus;
        setIsFollowing(cachedIsFollowing);
        setFriendRequestSent(cachedRequestSent);
      } else {
        // If not cached, fetch from database
        try {
          // Check if they are friends or have a pending request
          const { data, error } = await supabase.rpc('check_friendship_status', { 
            p_user_id: currentUserId, 
            p_friend_id: userData.id 
          });

          if (!error) {
            const newIsFollowing = data === 'accepted';
            const newFriendRequestSent = data === 'pending';
            
            setIsFollowing(newIsFollowing);
            setFriendRequestSent(newFriendRequestSent);
            
            // Cache the result
            setStorageWithExpiry(friendshipCacheKey, {
              isFollowing: newIsFollowing,
              friendRequestSent: newFriendRequestSent
            }, CACHE_DURATIONS.MEDIUM);
          }
        } catch (error) {
          console.error('Error checking friendship status:', error);
        }
      }
    };

    const getUserRating = async () => {
      const ratingCacheKey = generateCacheKey('user_rating', { 
        raterId: currentUserId, 
        ratedId: userData.id 
      });

      // Try to get cached user rating
      const cachedRating = getStorageWithExpiry(ratingCacheKey);
      if (cachedRating !== null) {
        setUserRating(cachedRating);
      } else if (currentUserId !== userData.id) {
        // Only fetch rating if viewing another user's profile
        try {
          const { data, error } = await supabase.rpc('get_user_rating', { 
            p_rater_id: currentUserId, 
            p_rated_id: userData.id 
          });

          if (!error && data !== null) {
            setUserRating(data);
            // Cache the result
            setStorageWithExpiry(ratingCacheKey, data, CACHE_DURATIONS.MEDIUM);
          }
        } catch (error) {
          console.error('Error getting user rating:', error);
        }
      }
    };

    checkFriendshipStatus();
    getUserRating();
    setUserReputation(userData?.reputation || 0);
    
  }, [userData?.id, currentUserId, userData?.reputation]);

  const handleFollowUser = async () => {
    if (!currentUserId || !userData?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour suivre un utilisateur",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFollowing) {
        // Remove friendship
        const { error } = await supabase
          .from('friendships')
          .delete()
          .or(`user_id.eq.${currentUserId},user_id.eq.${userData.id}`)
          .or(`friend_id.eq.${currentUserId},friend_id.eq.${userData.id}`);

        if (error) throw error;

        setIsFollowing(false);
        setFriendRequestSent(false);
        toast({
          title: "Succès",
          description: `Vous avez supprimé ${userData.username} de vos amis`,
        });
      } else if (friendRequestSent) {
        // Cancel friend request
        const { error } = await supabase
          .from('friendships')
          .delete()
          .or(`user_id.eq.${currentUserId},user_id.eq.${userData.id}`)
          .or(`friend_id.eq.${currentUserId},friend_id.eq.${userData.id}`);

        if (error) throw error;

        setFriendRequestSent(false);
        toast({
          title: "Succès",
          description: `Demande d'ami annulée`,
        });
      } else {
        // Send friend request
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
          title: "Succès",
          description: `Demande d'ami envoyée à ${userData.username}`,
        });
      }
      
      // Clear cached friendship status after change
      const friendshipCacheKey = generateCacheKey('friendship_status', { 
        userId: currentUserId, 
        friendId: userData.id 
      });
      clearCacheItem(friendshipCacheKey);
      
    } catch (error: any) {
      console.error('Error updating friendship:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'amitié",
        variant: "destructive",
      });
    }
  };

  const handleRatingChange = async (rating: number) => {
    if (!currentUserId || !userData?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour noter un utilisateur",
        variant: "destructive",
      });
      return;
    }

    try {
      if (userRating === 0) {
        // Insert new rating
        await supabase.rpc('insert_user_rating', {
          p_rater_id: currentUserId,
          p_rated_id: userData.id,
          p_rating: rating
        });
      } else {
        // Update existing rating
        await supabase.rpc('update_user_rating', {
          p_rater_id: currentUserId,
          p_rated_id: userData.id,
          p_rating: rating
        });
      }

      // Update local state
      setUserRating(rating);
      
      // Get updated reputation
      const { data: newReputation } = await supabase.rpc('get_average_rating', {
        p_user_id: userData.id
      });
      
      setUserReputation(newReputation || 0);
      
      // Update cache with new rating
      const ratingCacheKey = generateCacheKey('user_rating', { 
        raterId: currentUserId, 
        ratedId: userData.id 
      });
      setStorageWithExpiry(ratingCacheKey, rating, CACHE_DURATIONS.MEDIUM);
      
      toast({
        title: "Succès",
        description: `Vous avez attribué une note de ${rating} étoiles à ${userData.username}`,
      });
    } catch (error: any) {
      console.error('Error updating rating:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la notation",
        variant: "destructive",
      });
    }
  };

  return {
    isFollowing,
    friendRequestSent,
    userRating,
    userReputation,
    handleFollowUser,
    handleRatingChange
  };
};
