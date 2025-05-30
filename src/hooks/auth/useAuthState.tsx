
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStorageWithExpiry, setStorageWithExpiry, CACHE_DURATIONS } from '@/utils/cacheUtils';

// Cache keys
const USER_CACHE_KEY = 'auth_user';
const SESSION_CACHE_KEY = 'auth_session';
const AUTH_STATE_KEY = 'auth_state';
const REMEMBER_ME_KEY = 'auth_remember_me';

export const useAuthState = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    console.log("Initializing auth state");
    let mounted = true;
    let authTimeout: NodeJS.Timeout | undefined;
    
    // Check if session should be maintained
    const checkSessionValidity = () => {
      const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
      const cachedAuthState = getStorageWithExpiry(AUTH_STATE_KEY);
      
      // If user didn't choose "remember me" and there's no valid cached state, clear everything
      if (!rememberMe && !cachedAuthState) {
        localStorage.removeItem(USER_CACHE_KEY);
        localStorage.removeItem(SESSION_CACHE_KEY);
        localStorage.removeItem(AUTH_STATE_KEY);
        return false;
      }
      return true;
    };
    
    // First, check session validity
    if (!checkSessionValidity()) {
      setInitialLoading(false);
      return;
    }
    
    // Try to get from storage cache
    const cachedUser = getStorageWithExpiry(USER_CACHE_KEY);
    const cachedSession = getStorageWithExpiry(SESSION_CACHE_KEY);
    const cachedAuthState = getStorageWithExpiry(AUTH_STATE_KEY);
    
    if (cachedUser && cachedSession && cachedAuthState?.isAuthenticated) {
      console.log("Found cached auth state, setting user");
      setUser(cachedUser);
      setSession(cachedSession);
      setInitialLoading(false);
    }
    
    // Set up auth change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state change:", event);
        
        // Update state based on auth event
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (newSession && mounted) {
            console.log("Signed in, loading user profile");
            
            // Use setTimeout to prevent potential auth deadlock
            setTimeout(() => {
              if (mounted) {
                loadUserProfile(newSession.user.id, newSession);
              }
            }, 0);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("Signed out, clearing user state");
          if (mounted) {
            setUser(null);
            setSession(null);
          }
          localStorage.removeItem(USER_CACHE_KEY);
          localStorage.removeItem(SESSION_CACHE_KEY);
          localStorage.removeItem(AUTH_STATE_KEY);
          localStorage.removeItem(REMEMBER_ME_KEY);
        }
      }
    );

    // Get initial session with a timeout to prevent infinite loading
    const initializeAuth = async () => {
      try {
        console.log("Getting initial session");
        if (!mounted) return;
        
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (initialSession && !error) {
          console.log("Found initial session, loading user profile");
          if (mounted) {
            // Use setTimeout to prevent potential auth deadlock
            setTimeout(() => {
              if (mounted) {
                loadUserProfile(initialSession.user.id, initialSession);
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

    // Add a timeout to prevent infinite loading state - reduced to 3 seconds
    authTimeout = setTimeout(() => {
      if (mounted && initialLoading) {
        console.log("Auth initialization timeout reached, setting loading to false");
        setInitialLoading(false);
      }
    }, 3000);

    if (!cachedUser || !cachedSession) {
      initializeAuth();
    } else {
      // Even if we have cached user, still load the latest profile data
      if (cachedUser.id) {
        setTimeout(() => {
          if (mounted) {
            loadUserProfile(cachedUser.id, cachedSession);
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

  // Helper function to load user profile data
  const loadUserProfile = async (userId: string, currentSession: any) => {
    try {
      console.log("Loading user profile data for:", userId);
      // Fetch the user's profile data
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("Error loading profile:", error);
        setInitialLoading(false);
        return;
      }

      if (profile) {
        console.log("Profile loaded successfully");
        // Construct complete user object with both auth and profile data
        const fullUser = {
          ...currentSession.user,
          ...profile,
        };

        // Update state and cache
        setUser(fullUser);
        setSession(currentSession);
        
        // Determine cache duration based on remember me preference
        const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
        const cacheDuration = rememberMe ? CACHE_DURATIONS.MEDIUM : CACHE_DURATIONS.SHORT;
        
        setStorageWithExpiry(USER_CACHE_KEY, fullUser, cacheDuration);
        setStorageWithExpiry(SESSION_CACHE_KEY, currentSession, cacheDuration);
        setStorageWithExpiry(AUTH_STATE_KEY, { isAuthenticated: true, value: true }, cacheDuration);
      } else {
        console.warn("No profile found for user:", userId);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  return { user, session, initialLoading };
};
