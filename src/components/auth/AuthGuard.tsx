
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children,
  redirectTo = '/login'
}) => {
  const { user, initialLoading } = useAuth();
  const location = useLocation();

  // Limit the loading spinner display time
  const [showLoadingScreen, setShowLoadingScreen] = React.useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingScreen(false);
    }, 3000); // Show loading for max 3 seconds
    
    return () => clearTimeout(timer);
  }, []);

  // Show loading spinner while checking auth state
  if (initialLoading && showLoadingScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-airsoft-red" />
        <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login page
  if (!user) {
    console.log("User not authenticated, redirecting to", redirectTo);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default AuthGuard;
