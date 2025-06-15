
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
        
        const { data: warnings, error: warningsError } = await supabase
            .from('user_warnings')
            .select('*')
            .eq('warned_user_id', userData.id)
            .order('created_at', { ascending: false });

        if (warningsError) {
            console.error("Error fetching user warnings:", warningsError.message);
            throw warningsError;
        }

        if (!warnings || warnings.length === 0) {
            return [];
        }

        const adminIds = [...new Set(warnings.map(w => w.admin_id).filter(Boolean))];

        if (adminIds.length === 0) {
            return warnings.map(w => ({ ...w, admin_profile: null }));
        }

        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', adminIds as string[]);

        if (profileError) {
            console.error("Error fetching admin profiles for warnings:", profileError.message);
            // Return warnings without admin names in case of profile fetch error
            return warnings.map(w => ({ ...w, admin_profile: null }));
        }

        const profilesById = new Map(profiles.map(p => [p.id, p]));

        return warnings.map(warning => {
            const adminProfile = warning.admin_id ? profilesById.get(warning.admin_id) : null;
            return {
                ...warning,
                admin_profile: (adminProfile && adminProfile.username) ? { username: adminProfile.username } : null,
            };
        });
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
