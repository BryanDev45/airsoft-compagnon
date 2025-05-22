
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { getStorageWithExpiry, setStorageWithExpiry, clearCacheByPrefix, CACHE_DURATIONS } from '@/utils/cacheUtils';

// Cache keys
const USER_CACHE_KEY = 'auth_user';
const SESSION_CACHE_KEY = 'auth_session';
const AUTH_STATE_KEY = 'auth_state';

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      setLoading(true);
      
      // Clear any previous auth state first
      clearCacheByPrefix('auth_');
      
      console.log("Attempting login with email:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });

      if (error) {
        console.error("Login error:", error);
        toast({
          title: "Erreur de connexion",
          description: error.message || "Identifiants invalides",
          variant: "destructive",
        });
        return false;
      }

      if (data && data.user) {
        console.log("Login successful, user data received");
        
        // Cache the auth state
        const ttl = rememberMe ? CACHE_DURATIONS.LONG : CACHE_DURATIONS.MEDIUM;
        setStorageWithExpiry(USER_CACHE_KEY, data.user, ttl);
        setStorageWithExpiry(SESSION_CACHE_KEY, data.session, ttl);
        setStorageWithExpiry(AUTH_STATE_KEY, { isAuthenticated: true, value: true }, ttl);
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur Airsoft Compagnon",
        });
        
        // Navigate to profile page
        navigate('/profile');
        return true;
      } else {
        console.error("No user data returned from login");
        toast({
          title: "Erreur de connexion",
          description: "Aucune donnée utilisateur retournée",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      console.error("Login process error:", error);
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);

      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error(`Erreur lors de la vérification de l'email: ${checkError.message}`);
      }

      if (existingUser) {
        throw new Error('Cette adresse email est déjà utilisée.');
      }

      // Create the user in the auth system with metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData, // This metadata will be used by the trigger to create the profile
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error("Erreur lors de la création du compte");

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès.",
      });

      navigate('/profile');
    } catch (error: any) {
      console.error("Erreur d'inscription:", error);
      toast({
        title: "Erreur d'inscription",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Perform Supabase logout
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear all auth-related cache
      localStorage.removeItem(USER_CACHE_KEY);
      localStorage.removeItem(SESSION_CACHE_KEY);
      localStorage.removeItem(AUTH_STATE_KEY);
      clearCacheByPrefix('userProfile_');
      clearCacheByPrefix('profile_data');
      clearCacheByPrefix('user_stats');
      clearCacheByPrefix('notifications');
      
      // Navigate to login page
      navigate('/login');
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error: any) {
      console.error('Error during logout:', error);
      toast({
        title: "Erreur de déconnexion",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    login,
    register,
    logout
  };
};
