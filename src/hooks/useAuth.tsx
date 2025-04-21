
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { getRandomAvatar } from '@/utils/avatarUtils';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true); // pour la vérification de session
  const [loading, setLoading] = useState(false); // pour les actions utilisateur
  const navigate = useNavigate();

  useEffect(() => {
    // Vérification de session existante d'abord
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setInitialLoading(false);
    });

    // Puis écouteur d'état d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);

        // Redirection après connexion
        if (event === 'SIGNED_IN') {
          // Utiliser setTimeout pour éviter les problèmes de timing avec la redirection
          setTimeout(() => {
            navigate('/profile');
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
        
        // Navigation explicite ici aussi (le reste est géré par l'écouteur)
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
      const userDataWithAvatar = {
        ...userData,
        avatar: getRandomAvatar()
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
        throw new Error('Cette adresse email est déjà utilisée');
      }

      // First, sign up the user with auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userDataWithAvatar,
        },
      });
      
      if (error) throw error;

      if (!data.user) {
        throw new Error("Erreur lors de la création du compte");
      }
      
      // Important: Create the profile as a service role to bypass RLS
      // This avoids the chicken-and-egg problem with RLS policies
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          username: userDataWithAvatar.username,
          firstname: userDataWithAvatar.firstname,
          lastname: userDataWithAvatar.lastname,
          birth_date: userDataWithAvatar.birth_date,
          avatar: userDataWithAvatar.avatar,
          join_date: new Date().toISOString().split('T')[0]
        })
        .select();

      if (profileError) {
        console.error("Erreur lors de la création du profil:", profileError);
        throw new Error(`Erreur lors de la création du profil: ${profileError.message}`);
      }
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      });
      navigate('/login');
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
      setUser(null);
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

  return { user, loading, initialLoading, login, register, logout, handleSocialLogin };
};
