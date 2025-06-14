
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { checkSessionValidity, getCachedAuthData } from './state/useAuthStorage';
import { useProfileLoader } from './state/useProfileLoader';

export const useAuthState = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const { loadUserProfile } = useProfileLoader();

  useEffect(() => {
    console.log("Initializing auth state");
    let mounted = true;
    let authTimeout: NodeJS.Timeout | undefined;
    
    if (!checkSessionValidity()) {
      setInitialLoading(false);
      return;
    }
    
    const { cachedUser, cachedSession, cachedAuthState } = getCachedAuthData();
    
    if (cachedUser && cachedSession && cachedAuthState?.isAuthenticated) {
      console.log("Found cached auth state, setting user");
      setUser(cachedUser);
      setSession(cachedSession);
      setInitialLoading(false);
    }
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state change:", event);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (newSession && mounted) {
            console.log("Signed in, loading user profile");
            
            setTimeout(() => {
              if (mounted) {
                loadUserProfile(newSession.user.id, newSession, setUser, setSession, setInitialLoading);
              }
            }, 0);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("Signed out, clearing user state");
          if (mounted) {
            setUser(null);
            setSession(null);
          }
          // Clear storage
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_session');
          localStorage.removeItem('auth_state');
          localStorage.removeItem('auth_remember_me');
          sessionStorage.removeItem('auth_user');
          sessionStorage.removeItem('auth_session');
          sessionStorage.removeItem('auth_state');
        }
      }
    );

    const initializeAuth = async () => {
      try {
        console.log("Getting initial session");
        if (!mounted) return;
        
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (initialSession && !error) {
          console.log("Found initial session, loading user profile");
          if (mounted) {
            setTimeout(() => {
              if (mounted) {
                loadUserProfile(initialSession.user.id, initialSession, setUser, setSession, setInitialLoading);
              }
            }, 0);
          }
        } else {
          console.log("No initial session found or error:", error);
          if (mounted) {
            setInitialLoading(false);
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          setInitialLoading(false);
        }
      }
    };

    authTimeout = setTimeout(() => {
      if (mounted && initialLoading) {
        console.log("Auth initialization timeout reached, setting loading to false");
        setInitialLoading(false);
      }
    }, 3000);

    if (!cachedUser || !cachedSession) {
      initializeAuth();
    } else {
      if (cachedUser.id) {
        setTimeout(() => {
          if (mounted) {
            loadUserProfile(cachedUser.id, cachedSession, setUser, setSession, setInitialLoading);
          }
        }, 0);
      } else {
        setInitialLoading(false);
      }
    }

    return () => {
      mounted = false;
      if (authTimeout) clearTimeout(authTimeout);
      subscription?.unsubscribe();
    };
  }, []);

  return { user, session, initialLoading };
};
