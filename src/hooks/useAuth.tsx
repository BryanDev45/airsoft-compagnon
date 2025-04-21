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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);

        if (event === 'SIGNED_IN') {
          setTimeout(() => {
            navigate('/profile');
          }, 0);
        }
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setTimeout(() => {
            navigate('/login');
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setInitialLoading(false);
    });

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

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userDataWithAvatar,
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error("Erreur lors de la création du compte");

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
        });

      if (profileError) {
        console.error("Erreur lors de la création du profil:", profileError);
        if (
          profileError.message &&
          profileError.message.includes("new row violates row-level security policy")
        ) {
          throw new Error(
            "Erreur RLS lors de l'inscription : veuillez vérifier la politique de sécurité (RLS) pour la table 'profiles' dans Supabase. Donnez accès à l'utilisateur connecté pour INSERT."
          );
        }
        throw new Error(`Erreur lors de la création du profil: ${profileError.message}`);
      }

      const { error: statsError } = await supabase
        .from('user_stats')
        .insert({
          user_id: data.user.id,
        });

      if (statsError) {
        console.error("Erreur lors de la création des statistiques:", statsError);
      }

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
