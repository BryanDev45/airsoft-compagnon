
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const useLoginLogic = () => {
  const { initialLoading } = useAuth();
  const navigate = useNavigate();
  const [pageLoaded, setPageLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    console.log("Login page rendered, checking auth state");
    const checkAuthTimeout = setTimeout(() => {
      try {
        const isAuthenticated = localStorage.getItem('auth_state');
        if (isAuthenticated) {
          const authState = JSON.parse(isAuthenticated);
          if (authState && authState.isAuthenticated && authState.value) {
            console.log("User already authenticated, redirecting to profile");
            navigate('/profile');
          }
        }
      } catch (e) {
        console.error("Error parsing auth state:", e);
      }
    }, 500);
    
    return () => clearTimeout(checkAuthTimeout);
  }, [navigate]);

  const isLoading = !pageLoaded || initialLoading;

  return { isLoading };
};
