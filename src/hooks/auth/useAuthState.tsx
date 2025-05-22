
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStorageWithExpiry, setStorageWithExpiry, CACHE_DURATIONS } from '@/utils/cacheUtils';

// Cache keys
const USER_CACHE_KEY = 'auth_user';
const SESSION_CACHE_KEY = 'auth_session';
const AUTH_STATE_KEY = 'auth_state';

export const useAuthState = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // First, try to get from storage cache
    const cachedUser = getStorageWithExpiry(USER_CACHE_KEY);
    const cachedSession = getStorageWithExpiry(SESSION_CACHE_KEY);
    const cachedAuthState = getStorageWithExpiry(AUTH_STATE_KEY);
    
    if (cachedUser && cachedSession && cachedAuthState?.isAuthenticated) {
      setUser(cachedUser);
      setSession(cachedSession);
      
      // Even if we have cache, still load latest data in background
      loadUserProfile(cachedUser.id, cachedSession);
    }
    
    // Set up auth change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        // Update state based on auth event
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (newSession) {
            // Get user profile data
            await loadUserProfile(newSession.user.id, newSession);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          localStorage.removeItem(USER_CACHE_KEY);
          localStorage.removeItem(SESSION_CACHE_KEY);
          localStorage.removeItem(AUTH_STATE_KEY);
        }
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (initialSession && !error) {
          await loadUserProfile(initialSession.user.id, initialSession);
        } else {
          setInitialLoading(false);
        }
        
      } catch (error) {
        console.error('Error getting initial session:', error);
        setInitialLoading(false);
      }
    };

    if (!cachedUser || !cachedSession) {
      initializeAuth();
    } else {
      setInitialLoading(false);
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Helper function to load user profile data
  const loadUserProfile = async (userId: string, currentSession: any) => {
    try {
      // Fetch the user's profile data
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (profile) {
        // Construct complete user object with both auth and profile data
        const fullUser = {
          ...currentSession.user,
          ...profile,
        };

        // Update state and cache
        setUser(fullUser);
        setSession(currentSession);
        setStorageWithExpiry(USER_CACHE_KEY, fullUser, CACHE_DURATIONS.MEDIUM);
        setStorageWithExpiry(SESSION_CACHE_KEY, currentSession, CACHE_DURATIONS.MEDIUM);
        setStorageWithExpiry(AUTH_STATE_KEY, { isAuthenticated: true }, CACHE_DURATIONS.MEDIUM);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  return { user, session, initialLoading };
};
