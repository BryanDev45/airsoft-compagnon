
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const useLoginLogic = () => {
  const { initialLoading, user } = useAuth();
  const navigate = useNavigate();
  const [pageLoaded, setPageLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Check if user is already authenticated and redirect
  useEffect(() => {
    console.log("🔍 Login page rendered, checking auth state");
    console.log("🔍 User:", user ? "Authenticated" : "Not authenticated");
    console.log("🔍 Initial loading:", initialLoading);
    
    if (!initialLoading && user) {
      console.log("✅ User already authenticated, redirecting to profile");
      navigate('/profile', { replace: true });
      return;
    }
    
    // Fallback check using localStorage
    if (!initialLoading && !user) {
      try {
        const authState = localStorage.getItem('auth_state');
        if (authState) {
          const parsedAuthState = JSON.parse(authState);
          if (parsedAuthState && parsedAuthState.data && parsedAuthState.data.isAuthenticated) {
            console.log("✅ Found cached auth state, redirecting to profile");
            navigate('/profile', { replace: true });
            return;
          }
        }
      } catch (e) {
        console.error("❌ Error parsing auth state:", e);
      }
    }
  }, [navigate, user, initialLoading]);

  const isLoading = !pageLoaded || initialLoading;

  return { isLoading };
};
