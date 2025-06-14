
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { clearCacheByPrefix } from '@/utils/cacheUtils';

// Cache keys
const USER_CACHE_KEY = 'auth_user';
const SESSION_CACHE_KEY = 'auth_session';
const AUTH_STATE_KEY = 'auth_state';
const REMEMBER_ME_KEY = 'auth_remember_me';

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      setLoading(true);
      
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.warn('Supabase logout error (non-critical):', error);
        }
      } catch (supabaseError) {
        console.warn('Supabase logout failed (continuing with local cleanup):', supabaseError);
      }
      
      try {
        localStorage.removeItem(USER_CACHE_KEY);
        localStorage.removeItem(SESSION_CACHE_KEY);
        localStorage.removeItem(AUTH_STATE_KEY);
        localStorage.removeItem(REMEMBER_ME_KEY);
        
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
      
      navigate('/login');
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error: any) {
      console.error('Error during logout:', error);
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

  return { logout, loading };
};
