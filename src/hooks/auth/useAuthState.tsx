
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { getStorageWithExpiry, setStorageWithExpiry, clearCacheByPrefix, CACHE_DURATIONS } from '@/utils/cacheUtils';

// Cache keys
const USER_CACHE_KEY = 'auth_user';
const SESSION_CACHE_KEY = 'auth_session';
const AUTH_STATE_KEY = 'auth_state';

export const useAuthState = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Update the cache when user state changes
  useEffect(() => {
    if (user) {
      setStorageWithExpiry(USER_CACHE_KEY, user, CACHE_DURATIONS.MEDIUM);
      setStorageWithExpiry(AUTH_STATE_KEY, { isAuthenticated: true }, CACHE_DURATIONS.MEDIUM);
    }
    if (session) {
      setStorageWithExpiry(SESSION_CACHE_KEY, session, CACHE_DURATIONS.MEDIUM);
    }
  }, [user, session]);

  useEffect(() => {
    let isMounted = true;
    
    // Check cached auth state immediately for faster UI rendering
    const cachedAuthState = getStorageWithExpiry(AUTH_STATE_KEY);
    const cachedUser = getStorageWithExpiry(USER_CACHE_KEY);
    const cachedSession = getStorageWithExpiry(SESSION_CACHE_KEY);
    
    if (cachedAuthState?.isAuthenticated && cachedUser && isMounted) {
      setUser(cachedUser);
      if (cachedSession) {
        setSession(cachedSession);
      }
    }

    // Set up the auth state listener to avoid missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (isMounted) {
          console.log('Auth state changed:', event);
          
          if (newSession) {
            setSession(newSession);
            setUser(newSession.user || null);
            
            // Update cache
            setStorageWithExpiry(SESSION_CACHE_KEY, newSession, CACHE_DURATIONS.MEDIUM);
            setStorageWithExpiry(USER_CACHE_KEY, newSession.user, CACHE_DURATIONS.MEDIUM);
            setStorageWithExpiry(AUTH_STATE_KEY, { isAuthenticated: true }, CACHE_DURATIONS.MEDIUM);
          } else if (event === 'SIGNED_OUT') {
            // Clear user and auth state on sign out
            setUser(null);
            setSession(null);
            
            // Clear all auth-related cache
            localStorage.removeItem(USER_CACHE_KEY);
            localStorage.removeItem(SESSION_CACHE_KEY);
            localStorage.removeItem(AUTH_STATE_KEY);
            
            // Clear profile cache
            clearCacheByPrefix('userProfile_');
            clearCacheByPrefix('profile_data');
            clearCacheByPrefix('user_stats');
            clearCacheByPrefix('notifications');

            // Use setTimeout to avoid potential deadlocks
            if (location.pathname !== '/login' && location.pathname !== '/register' && event === 'SIGNED_OUT') {
              setTimeout(() => {
                if (isMounted) navigate('/login');
              }, 0);
            }
          }
          
          // For login events, handle navigation
          if (event === 'SIGNED_IN' && (location.pathname === '/login' || location.pathname === '/register')) {
            setTimeout(() => {
              if (isMounted) navigate('/profile');
            }, 0);
          }
        }
      }
    );

    // Verify with Supabase if the session is still valid
    const fetchSession = async () => {
      try {
        const { data: { session: supabaseSession } } = await supabase.auth.getSession();
        
        if (isMounted) {
          if (supabaseSession) {
            setSession(supabaseSession);
            setUser(supabaseSession.user || null);
            
            // Update cache
            setStorageWithExpiry(SESSION_CACHE_KEY, supabaseSession, CACHE_DURATIONS.MEDIUM);
            setStorageWithExpiry(USER_CACHE_KEY, supabaseSession.user, CACHE_DURATIONS.MEDIUM);
            setStorageWithExpiry(AUTH_STATE_KEY, { isAuthenticated: true }, CACHE_DURATIONS.MEDIUM);
          } else if (cachedAuthState?.isAuthenticated) {
            // If no session but cached auth exists, it means the session expired
            clearCacheByPrefix('auth_');
            setUser(null);
            setSession(null);
          }
          
          setInitialLoading(false);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        if (isMounted) {
          setInitialLoading(false);
          
          // Clear cached auth state if there's an error
          clearCacheByPrefix('auth_');
        }
      }
    };

    // If we don't have cached data, or after a short delay, fetch fresh session data
    if (!cachedAuthState?.isAuthenticated || !cachedUser) {
      fetchSession();
    } else {
      // If we have cached data, still verify but with a delay to let the UI render first
      setTimeout(fetchSession, 100);
      // Don't wait for the verification to finish the initial loading
      setTimeout(() => {
        if (isMounted) setInitialLoading(false);
      }, 50);
    }

    // Set up a safety timeout to prevent infinite loading
    const safetyTimeout = setTimeout(() => {
      if (isMounted && initialLoading) {
        setInitialLoading(false);
      }
    }, 3000);

    // Set up regular session refresh if user is authenticated
    let refreshInterval: number;
    if (cachedAuthState?.isAuthenticated) {
      refreshInterval = window.setInterval(async () => {
        const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
        if (error) {
          console.error("Error refreshing session:", error);
        } else if (refreshedSession && isMounted) {
          setSession(refreshedSession);
          setUser(refreshedSession.user);
          
          // Update cache
          setStorageWithExpiry(SESSION_CACHE_KEY, refreshedSession, CACHE_DURATIONS.MEDIUM);
          setStorageWithExpiry(USER_CACHE_KEY, refreshedSession.user, CACHE_DURATIONS.MEDIUM);
        }
      }, 10 * 60 * 1000); // 10 minutes
    }

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [navigate, location.pathname, initialLoading]);

  return { user, session, initialLoading };
};
