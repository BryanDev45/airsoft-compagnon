
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCachedAuthData } from './useAuthStorage';
import { useProfileLoader } from './useProfileLoader';

export const useSessionManager = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const { loadUserProfile } = useProfileLoader();

  const initializeFromCache = () => {
    const { cachedUser, cachedSession, cachedAuthState } = getCachedAuthData();
    
    if (cachedUser && cachedSession && cachedAuthState?.isAuthenticated) {
      console.log("Found cached auth state, setting user");
      setUser(cachedUser);
      setSession(cachedSession);
      setInitialLoading(false);
      return { cachedUser, cachedSession };
    }
    
    return { cachedUser: null, cachedSession: null };
  };

  const getInitialSession = async () => {
    try {
      console.log("Getting initial session");
      const { data: { session: initialSession }, error } = await supabase.auth.getSession();
      
      if (initialSession && !error) {
        console.log("Found initial session, loading user profile");
        return initialSession;
      } else {
        console.log("No initial session found or error:", error);
        setInitialLoading(false);
        return null;
      }
    } catch (error) {
      console.error('Error getting initial session:', error);
      setInitialLoading(false);
      return null;
    }
  };

  const clearAuthState = () => {
    console.log("Signed out, clearing user state");
    setUser(null);
    setSession(null);
    
    // Clear storage
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_session');
    localStorage.removeItem('auth_state');
    localStorage.removeItem('auth_remember_me');
    sessionStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_session');
    sessionStorage.removeItem('auth_state');
  };

  const loadProfile = (userId: string, sessionData: any) => {
    setTimeout(() => {
      loadUserProfile(userId, sessionData, setUser, setSession, setInitialLoading);
    }, 0);
  };

  return {
    user,
    session,
    initialLoading,
    setUser,
    setSession,
    setInitialLoading,
    initializeFromCache,
    getInitialSession,
    clearAuthState,
    loadProfile
  };
};
