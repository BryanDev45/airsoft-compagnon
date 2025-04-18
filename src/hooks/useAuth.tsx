
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { UserResponse } from '@supabase/supabase-js';
import { getRandomAvatar } from '@/utils/avatarUtils';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/profile');
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur Airsoft Compagnon",
      });
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const register = async (email: string, password: string, userData: any) => {
    try {
      // Ajouter un avatar aléatoire aux données utilisateur
      const userDataWithAvatar = {
        ...userData,
        avatar: getRandomAvatar()
      };

      // Vérifier si l'email existe déjà
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error(`Erreur lors de la vérification de l'email: ${checkError.message}`);
      }

      if (existingUser) {
        throw new Error('Cette adresse email est déjà utilisée');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userDataWithAvatar,
        },
      });
      
      if (error) throw error;

      // Si l'inscription est réussie mais qu'aucun utilisateur n'est créé
      if (!data.user) {
        throw new Error("Erreur lors de la création du compte");
      }
      
      toast({
        title: "Inscription réussie",
        description: "Bienvenue sur Airsoft Compagnon",
      });
      navigate('/profile');
    } catch (error: any) {
      console.error("Erreur d'inscription:", error);
      toast({
        title: "Erreur d'inscription",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error: any) {
      toast({
        title: "Erreur de déconnexion",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin + '/profile',
        },
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

  return { user, loading, login, register, logout, handleSocialLogin };
};
