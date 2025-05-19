
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    // First, set up the auth state listener to avoid missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          // Check if the user is banned before setting the user state
          checkIfBanned(session?.user?.id).then(isBanned => {
            if (isBanned) {
              // If banned, log the user out immediately
              supabase.auth.signOut().then(() => {
                toast({
                  title: "Accès refusé",
                  description: "Votre compte a été banni par un administrateur",
                  variant: "destructive",
                });
                navigate('/login');
              });
            } else {
              // Not banned, proceed normally
              setUser(session?.user || null);
              
              // Only navigate to profile if we're on the login or register page
              if (location.pathname === '/login' || location.pathname === '/register') {
                // Use setTimeout to avoid potential deadlocks
                setTimeout(() => {
                  navigate('/profile');
                  // Force page reload after navigation to ensure fresh data loading
                  window.location.reload();
                }, 0);
              }
            }
          });
        }
        else if (event === 'SIGNED_OUT') {
          setUser(null);
          // Use setTimeout to avoid potential deadlocks
          setTimeout(() => {
            navigate('/login');
          }, 0);
        }
        else if (event !== 'TOKEN_REFRESHED') {
          // For other events (PASSWORD_RECOVERY, etc), just update the user state
          setUser(session?.user || null);
        }
      }
    );

    // Helper function to check if a user is banned
    const checkIfBanned = async (userId: string | undefined): Promise<boolean> => {
      if (!userId) return false;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('Ban')
          .eq('id', userId)
          .single();
          
        if (error || !data) return false;
        return data.Ban === true;
      } catch (error) {
        console.error("Error checking if user is banned:", error);
        return false;
      }
    };

    // Configurer la persistance de session et la récupération de la session
    const setupSessionPersistence = async () => {
      // Vérifier s'il y a une session existante
      const { data: { session } } = await supabase.auth.getSession();
      
      // Check if the logged-in user is banned
      if (session?.user) {
        const isBanned = await checkIfBanned(session.user.id);
        if (isBanned) {
          // If banned, log out and don't set the user state
          await supabase.auth.signOut();
          toast({
            title: "Accès refusé",
            description: "Votre compte a été banni par un administrateur",
            variant: "destructive",
          });
          navigate('/login');
          setUser(null);
          setInitialLoading(false);
          return;
        }
      }
      
      setUser(session?.user || null);
      setInitialLoading(false);

      // Si un utilisateur est authentifié, configurer une vérification régulière de session
      if (session?.user) {
        // Rafraîchir la session toutes les 10 minutes pour éviter l'expiration
        const interval = setInterval(async () => {
          const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
          if (error) {
            console.error("Erreur lors du rafraîchissement de la session:", error);
          }
        }, 10 * 60 * 1000); // 10 minutes

        return () => clearInterval(interval);
      }
    };

    setupSessionPersistence();
    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

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
        // Check if the user is banned
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('Ban')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          console.error("Error checking if user is banned:", profileError);
        }
        
        // If the user is banned, prevent login
        if (profile && profile.Ban === true) {
          // Sign out immediately
          await supabase.auth.signOut();
          
          toast({
            title: "Accès refusé",
            description: "Votre compte a été banni par un administrateur",
            variant: "destructive",
          });
          return false;
        }
        
        // User not banned, proceed with login
        setUser(data.user);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur Airsoft Compagnon",
        });
        
        // Naviguer et recharger la page pour garantir un état frais
        navigate('/profile');
        window.location.reload();
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
