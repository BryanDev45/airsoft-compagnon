
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';
import { useSocialAuth } from './useSocialAuth';

export const useAuth = () => {
  const { user, session, initialLoading } = useAuthState();
  const { loading: actionsLoading, login, register, logout } = useAuthActions();
  const { loading: socialLoading, handleSocialAuth } = useSocialAuth();

  const loading = actionsLoading || socialLoading;

  const enhancedUser = user ? {
    ...user,
    team_id: user.team_id || null,
  } : null;

  return {
    user: enhancedUser,
    session,
    loading,
    initialLoading,
    login,
    register,
    logout,
    handleSocialLogin: handleSocialAuth
  };
};
