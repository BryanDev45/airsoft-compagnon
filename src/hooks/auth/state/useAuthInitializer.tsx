
import { useEffect } from 'react';
import { checkSessionValidity } from './useAuthStorage';

interface UseAuthInitializerProps {
  initialLoading: boolean;
  setInitialLoading: (loading: boolean) => void;
  initializeFromCache: () => { cachedUser: any; cachedSession: any };
  getInitialSession: () => Promise<any>;
  loadProfile: (userId: string, sessionData: any) => void;
}

export const useAuthInitializer = ({
  initialLoading,
  setInitialLoading,
  initializeFromCache,
  getInitialSession,
  loadProfile
}: UseAuthInitializerProps) => {
  useEffect(() => {
    console.log("Initializing auth state");
    let mounted = true;
    let authTimeout: NodeJS.Timeout | undefined;
    
    if (!checkSessionValidity()) {
      setInitialLoading(false);
      return;
    }
    
    const { cachedUser, cachedSession } = initializeFromCache();
    
    const initializeAuth = async () => {
      try {
        console.log("Getting initial session");
        if (!mounted) return;
        
        const initialSession = await getInitialSession();
        
        if (initialSession && mounted) {
          console.log("Found initial session, loading user profile");
          // Load profile immediately without setTimeout for faster auth
          loadProfile(initialSession.user.id, initialSession);
        } else if (mounted) {
          setInitialLoading(false);
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
    }, 2000); // Reduced from 3s to 2s for faster loading

    if (!cachedUser || !cachedSession) {
      initializeAuth();
    } else {
      if (cachedUser.id) {
        loadProfile(cachedUser.id, cachedSession);
      } else {
        setInitialLoading(false);
      }
    }

    return () => {
      mounted = false;
      if (authTimeout) clearTimeout(authTimeout);
    };
  }, []);
};
