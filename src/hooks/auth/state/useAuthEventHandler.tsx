
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseAuthEventHandlerProps {
  loadProfile: (userId: string, sessionData: any) => void;
  clearAuthState: () => void;
}

export const useAuthEventHandler = ({ loadProfile, clearAuthState }: UseAuthEventHandlerProps) => {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state change:", event);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (newSession) {
            console.log("Signed in, loading user profile");
            loadProfile(newSession.user.id, newSession);
          }
        } else if (event === 'SIGNED_OUT') {
          clearAuthState();
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [loadProfile, clearAuthState]);
};
