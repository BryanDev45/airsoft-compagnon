
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { getStorageWithExpiry } from '@/utils/cacheUtils';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, initialLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Fast initial check using cached data
    const cachedAuthState = getStorageWithExpiry('auth_state');
    const cachedUser = getStorageWithExpiry('auth_user');
    
    if (cachedAuthState?.isAuthenticated && cachedUser) {
      setIsAuthenticated(true);
      setIsChecking(false);
    }
    
    // Then verify with actual auth state once it loads
    if (!initialLoading) {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Only show toast and navigate if we're not already on the login page
        if (location.pathname !== '/login' && location.pathname !== '/register') {
          toast({
            title: "Accès refusé",
            description: "Veuillez vous connecter pour accéder à cette page",
            variant: "destructive"
          });
          navigate('/login');
        }
      }
      setIsChecking(false);
    }
  }, [user, initialLoading, navigate, location.pathname]);

  // Show skeleton loader only if we don't have cached auth data
  if ((initialLoading || isChecking) && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <Skeleton className="h-12 w-12 rounded-full bg-airsoft-red mb-4" />
          <Skeleton className="h-4 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  // Show content immediately if we have cached auth data
  if (isAuthenticated || user) {
    // Check if user is banned
    if (user?.user_metadata?.Ban === true) {
      toast({
        title: "Compte banni",
        description: "Votre compte a été banni par un administrateur",
        variant: "destructive"
      });
      return <Navigate to="/login" />;
    }
    return <>{children}</>;
  }

  return <Navigate to="/login" />;
};

export default AuthGuard;
