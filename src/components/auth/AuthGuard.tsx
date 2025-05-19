
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, initialLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    // Check if the user is banned
    const checkBanStatus = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('Ban')
            .eq('id', user.id)
            .single();
            
          if (error) {
            console.error("Error checking ban status:", error);
          } else if (data?.Ban === true) {
            setIsBanned(true);
            // Force logout if banned
            await supabase.auth.signOut();
            toast({
              title: "Accès refusé",
              description: "Votre compte a été banni par un administrateur",
              variant: "destructive"
            });
            navigate('/login');
          }
        } catch (error) {
          console.error("Error checking ban status:", error);
        }
      }
      setIsChecking(false);
    };

    // Wait for the initial verification to complete
    if (!initialLoading) {
      if (!user) {
        // Only show toast and navigate if we're not already on the login page
        if (location.pathname !== '/login' && location.pathname !== '/register') {
          toast({
            title: "Accès refusé",
            description: "Veuillez vous connecter pour accéder à cette page",
            variant: "destructive"
          });
          navigate('/login');
        }
        setIsChecking(false);
      } else {
        checkBanStatus();
      }
    }
  }, [user, initialLoading, navigate, location.pathname]);

  if (initialLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-airsoft-red mb-4"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user || isBanned) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default AuthGuard;
