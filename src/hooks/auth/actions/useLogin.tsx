
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

export const useLogin = () => {
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
        if (rememberMe) {
          const ttl = CACHE_DURATIONS.LONG;
          setStorageWithExpiry(USER_CACHE_KEY, data.user, ttl);
          setStorageWithExpiry(SESSION_CACHE_KEY, data.session, ttl);
          setStorageWithExpiry(AUTH_STATE_KEY, { isAuthenticated: true, value: true }, ttl);
        } else {
          sessionStorage.setItem(USER_CACHE_KEY, JSON.stringify({
            data: data.user,
            expiry: Date.now() + CACHE_DURATIONS.LONG
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

  return { login, loading };
};
