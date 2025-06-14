
import { supabase } from '@/integrations/supabase/client';
import { setStorageWithExpiry, CACHE_DURATIONS } from '@/utils/cacheUtils';
import { USER_CACHE_KEY, SESSION_CACHE_KEY, AUTH_STATE_KEY, REMEMBER_ME_KEY } from './useAuthStorage';

export const useProfileLoader = () => {
  const loadUserProfile = async (userId: string, currentSession: any, setUser: any, setSession: any, setInitialLoading: any) => {
    try {
      console.log("Loading user profile data for:", userId);
      
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
        
        const fullUser = {
          ...currentSession.user,
          ...profile,
        };

        setUser(fullUser);
        setSession(currentSession);
        
        const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
        
        if (rememberMe) {
          const cacheDuration = CACHE_DURATIONS.MEDIUM;
          setStorageWithExpiry(USER_CACHE_KEY, fullUser, cacheDuration);
          setStorageWithExpiry(SESSION_CACHE_KEY, currentSession, cacheDuration);
          setStorageWithExpiry(AUTH_STATE_KEY, { isAuthenticated: true, value: true }, cacheDuration);
        } else {
          sessionStorage.setItem(USER_CACHE_KEY, JSON.stringify({
            data: fullUser,
            expiry: Date.now() + CACHE_DURATIONS.LONG
          }));
          sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify({
            data: currentSession,
            expiry: Date.now() + CACHE_DURATIONS.LONG
          }));
          sessionStorage.setItem(AUTH_STATE_KEY, JSON.stringify({
            data: { isAuthenticated: true, value: true },
            expiry: Date.now() + CACHE_DURATIONS.LONG
          }));
        }
      } else {
        console.warn("No profile found for user:", userId);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  return { loadUserProfile };
};
