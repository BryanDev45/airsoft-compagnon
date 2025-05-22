
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';
import { useSocialAuth } from './useSocialAuth';

export const useAuth = () => {
  const { user, session, initialLoading } = useAuthState();
  const { loading: actionsLoading, login, register, logout } = useAuthActions();
  const { loading: socialLoading, handleSocialAuth } = useSocialAuth();

  const loading = actionsLoading || socialLoading;

  return {
    user,
    session,
    loading,
    initialLoading,
    login,
    register,
    logout,
    handleSocialLogin: handleSocialAuth
  };
};
