
import { useSessionManager } from './state/useSessionManager';
import { useAuthEventHandler } from './state/useAuthEventHandler';
import { useAuthInitializer } from './state/useAuthInitializer';

export const useAuthState = () => {
  const {
    user,
    session,
    initialLoading,
    setInitialLoading,
    initializeFromCache,
    getInitialSession,
    clearAuthState,
    loadProfile
  } = useSessionManager();

  useAuthEventHandler({ loadProfile, clearAuthState });

  useAuthInitializer({
    initialLoading,
    setInitialLoading,
    initializeFromCache,
    getInitialSession,
    loadProfile
  });

  return { user, session, initialLoading };
};
