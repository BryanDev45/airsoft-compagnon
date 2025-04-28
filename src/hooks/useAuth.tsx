
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { getRandomAvatar, getAllDefaultAvatars } from '@/utils/avatarUtils';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // First, check for an existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setInitialLoading(false);
    });

    // Then set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);

        if (event === 'SIGNED_IN') {
          // Utiliser setTimeout pour éviter les deadlocks potentiels
          setTimeout(() => {
            navigate('/profile');
          }, 0);
        }
        if (event === 'SIGNED_OUT') {
          setUser(null);
          // Utiliser setTimeout pour éviter les deadlocks potentiels
          setTimeout(() => {
            navigate('/login');
          }, 0);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });

      if (error) {
        throw error;
      }

      if (data && data.user) {
        setUser(data.user);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur Airsoft Compagnon",
        });
        // Naviguer directement au lieu de laisser l'événement onAuthStateChange le faire
        // Cela assure que la navigation se produise, même en cas de problème avec l'événement
        navigate('/profile');
        return true;
      } else {
        throw new Error("Aucune donnée utilisateur retournée");
      }
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message,
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
      const userDataWithAvatar = {
        ...userData,
        avatar: getRandomAvatar(),
      };

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
          data: userDataWithAvatar, // This metadata will be used by the trigger to create the profile
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error("Erreur lors de la création du compte");

      // No need to manually insert into profiles table - it's handled by the database trigger
      // The handle_new_user function will create the profile entry automatically

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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      // Navigate to login page after successful logout
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
    } finally {
      setLoading(false);
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

  return { user, loading, initialLoading, login, register, logout, handleSocialLogin, getAllDefaultAvatars };
};
