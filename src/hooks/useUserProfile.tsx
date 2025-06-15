import { useUserProfileData } from './user-profile/useUserProfileData';
import { useUserSocial } from './user-profile/useUserSocial';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserWarning {
    id: string;
    warned_user_id: string;
    admin_id: string | null;
    reason: string;
    context: string | null;
    created_at: string;
    admin_profile?: { username: string } | null;
}

/**
 * Main hook for user profile functionality, combining data fetching and social interactions
 */
export const useUserProfile = (username: string | undefined) => {
  const {
    loading,
    userData,
    profileData,
    userStats,
    equipment,
    userGames,
    userBadges,
    currentUserId,
    isCurrentUserAdmin,
    updateLocation,
    updateUserStats,
    fetchProfileData
  } = useUserProfileData(username);

  const {
    isFollowing,
    friendRequestSent,
    userRating,
    userReputation,
    handleFollowUser,
    handleRatingChange
  } = useUserSocial(userData, currentUserId);

  const { data: userWarnings, isLoading: isLoadingWarnings } = useQuery<UserWarning[]>({
    queryKey: ['user-warnings', userData?.id],
    queryFn: async () => {
        if (!userData?.id) return [];
        
        const { data, error } = await supabase
            .from('user_warnings')
            .select('*, admin_profile:profiles(username)')
            .eq('warned_user_id', userData.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching user warnings:", error.message);
            // If join fails, try fetching without it.
            if (error.message.includes('could not find a relationship')) {
                 const { data: warningsData, error: warningsError } = await supabase
                    .from('user_warnings')
                    .select('*')
                    .eq('warned_user_id', userData.id)
                    .order('created_at', { ascending: false });
                if(warningsError) throw warningsError;
                return warningsData || [];
            }
            throw error;
        }

        return data || [];
    },
    enabled: !!userData?.id && isCurrentUserAdmin,
  });

  return {
    loading: loading || (isCurrentUserAdmin && isLoadingWarnings),
    userData,
    profileData,
    userStats,
    equipment,
    userGames,
    userBadges,
    isFollowing,
    friendRequestSent,
    userRating,
    userReputation,
    currentUserId,
    isCurrentUserAdmin,
    userWarnings,
    handleFollowUser,
    handleRatingChange,
    updateLocation,
    updateUserStats,
    fetchProfileData
  };
};
