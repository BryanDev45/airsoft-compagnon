
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginContainer from '../components/auth/LoginContainer';
import { useAuth } from '../hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

const Login = () => {
  const { user, initialLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Show message if redirected from a protected page
    if (location.state?.message) {
      toast({
        title: "Connexion requise",
        description: location.state.message,
        variant: "default",
      });
    }
  }, [location.state]);

  useEffect(() => {
    // Redirect authenticated users
    if (user && !initialLoading) {
      const redirectTo = location.state?.from || '/profile';
      navigate(redirectTo, { replace: true });
    }
  }, [user, initialLoading, navigate, location.state]);

  if (initialLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-airsoft-red rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <LoginContainer />
      </main>
      <Footer />
    </div>
  );
};

export default Login;
