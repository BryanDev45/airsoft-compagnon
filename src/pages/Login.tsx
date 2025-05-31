
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Loader2 } from 'lucide-react';
import LoginContainer from '../components/auth/LoginContainer';

const Login = () => {
  const { initialLoading } = useAuth();
  const navigate = useNavigate();
  const [pageLoaded, setPageLoaded] = useState(false);
  
  // Mark page as loaded after a small delay to improve perceived performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Check if user is already logged in - with timeout to avoid infinite state
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

  // Show a separate loading screen if the page is not fully loaded yet
  if (!pageLoaded || initialLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-airsoft-red" />
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
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <LoginContainer />
      </main>
      <Footer />
    </div>
  );
};

export default Login;
