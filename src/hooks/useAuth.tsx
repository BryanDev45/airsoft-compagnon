import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { getRandomAvatar, getAllDefaultAvatars } from '@/utils/avatarUtils';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthChange = useCallback(
    (event: string, session: any) => {
      const currentUser = session?.user || null;
      setUser(currentUser);

      switch (event) {
        case 'SIGNED_IN':
          if (['/login', '/register'].includes(location.pathname)) {
            setTimeout(() => navigate('/profile'), 0);
          }
          break;
        case 'SIGNED_OUT':
          setTimeout(() => navigate('/login'), 0);
          break;
      }
    },
    [navigate, location.pathname]
  );

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setInitialLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [handleAuthChange]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;
      if (!data.user) throw new Error("Aucune donnée utilisateur retournée");

      setUser(data.user);
      toast({ title: "Connexion réussie", description: "Bienvenue sur Airsoft Compagnon" });
      navigate('/profile');
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur est survenue.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: any) => {
    setLoading(true);
    try {
      const userDataWithAvatar = { ...userData, avatar: getRandomAvatar() };

      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error(`Erreur de vérification: ${checkError.message}`);
      }

      if (existingUser) {
        throw new Error("Cette adresse email est déjà utilisée.");
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: userDataWithAvatar },
      });

      if (error) throw error;
      if (!data.user) throw new Error("Erreur lors de la création du compte");

      toast({ title: "Inscription réussie", description: "Votre compte a été créé avec succès." });
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
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      toast({ title: "Déconnexion réussie", description: "À bientôt !" });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Erreur de déconnexion",
        description: error.message || "Une erreur est survenue.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/profile` },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: `Erreur de connexion avec ${provider}`,
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    user,
    loading,
    initialLoading,
    login,
    register,
    logout,
    handleSocialLogin,
    getAllDefaultAvatars,
  };
};
