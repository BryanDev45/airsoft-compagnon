
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { getStorageWithExpiry, setStorageWithExpiry, clearCacheByPrefix, CACHE_DURATIONS } from '@/utils/cacheUtils';

// Cache keys
const USER_CACHE_KEY = 'auth_user';
const SESSION_CACHE_KEY = 'auth_session';
const AUTH_STATE_KEY = 'auth_state';
const REMEMBER_ME_KEY = 'auth_remember_me';

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    if (!email || !password) {
      toast({
        title: "Erreur de connexion",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return false;
    }
    
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
        
        // Store remember me preference first
        localStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString());
        
        // Cache the auth state with appropriate duration
        // Si "resté connecté" n'est pas coché, utiliser sessionStorage pour la session et localStorage pour les autres données
        if (rememberMe) {
          // Utiliser localStorage avec une durée longue
          const ttl = CACHE_DURATIONS.LONG;
          setStorageWithExpiry(USER_CACHE_KEY, data.user, ttl);
          setStorageWithExpiry(SESSION_CACHE_KEY, data.session, ttl);
          setStorageWithExpiry(AUTH_STATE_KEY, { isAuthenticated: true, value: true }, ttl);
        } else {
          // Utiliser sessionStorage pour que les données persistent pendant la session du navigateur
          sessionStorage.setItem(USER_CACHE_KEY, JSON.stringify({
            data: data.user,
            expiry: Date.now() + CACHE_DURATIONS.LONG // Très longue durée pour la session
          }));
          sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify({
            data: data.session,
            expiry: Date.now() + CACHE_DURATIONS.LONG
          }));
          sessionStorage.setItem(AUTH_STATE_KEY, JSON.stringify({
            data: { isAuthenticated: true, value: true },
            expiry: Date.now() + CACHE_DURATIONS.LONG
          }));
        }
        
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
      
      // Perform Supabase logout first, handle errors gracefully
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.warn('Supabase logout error (non-critical):', error);
        }
      } catch (supabaseError) {
        console.warn('Supabase logout failed (continuing with local cleanup):', supabaseError);
      }
      
      // Always clear local storage and session storage regardless of Supabase response
      try {
        // Clear localStorage
        localStorage.removeItem(USER_CACHE_KEY);
        localStorage.removeItem(SESSION_CACHE_KEY);
        localStorage.removeItem(AUTH_STATE_KEY);
        localStorage.removeItem(REMEMBER_ME_KEY);
        
        // Clear sessionStorage
        sessionStorage.removeItem(USER_CACHE_KEY);
        sessionStorage.removeItem(SESSION_CACHE_KEY);
        sessionStorage.removeItem(AUTH_STATE_KEY);
        
        clearCacheByPrefix('userProfile_');
        clearCacheByPrefix('profile_data');
        clearCacheByPrefix('user_stats');
        clearCacheByPrefix('notifications');
      } catch (cacheError) {
        console.warn('Cache cleanup error (non-critical):', cacheError);
      }
      
      // Navigate to login page
      navigate('/login');
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error: any) {
      console.error('Error during logout:', error);
      // Even if there's an error, force the logout by clearing storage and navigating
      try {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
        toast({
          title: "Déconnexion effectuée",
          description: "Vous avez été déconnecté",
        });
      } catch (fallbackError) {
        console.error('Fallback logout failed:', fallbackError);
        toast({
          title: "Erreur de déconnexion",
          description: "Veuillez actualiser la page",
          variant: "destructive",
        });
      }
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
