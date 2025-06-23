
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const register = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);

      console.log('🔄 Starting registration process for:', email);
      console.log('📝 User data received:', userData);

      // Préparer les métadonnées utilisateur avec les bonnes clés
      const userMetadata = {
        username: userData.username,
        firstname: userData.firstname,
        lastname: userData.lastname,
        birth_date: userData.birth_date,
        // Ajout des clés alternatives pour compatibility avec différents providers
        first_name: userData.firstname,
        last_name: userData.lastname
      };

      console.log('📤 Sending user metadata to Supabase:', userMetadata);

      // Configuration de l'inscription avec redirection
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata,
          emailRedirectTo: redirectUrl
        },
      });

      if (error) {
        console.error('❌ Supabase signup error:', error);
        
        // Gestion des erreurs spécifiques
        if (error.message.includes('already registered')) {
          throw new Error('Cette adresse email est déjà utilisée.');
        } else if (error.message.includes('password')) {
          throw new Error('Le mot de passe ne respecte pas les critères de sécurité.');
        } else if (error.message.includes('email')) {
          throw new Error('L\'adresse email n\'est pas valide.');
        }
        
        throw new Error(error.message || 'Erreur lors de l\'inscription');
      }

      if (!data.user) {
        console.error('❌ No user returned from signup');
        throw new Error("Erreur lors de la création du compte");
      }

      console.log('✅ User created successfully:', data.user.id);
      console.log('📋 User metadata sent:', data.user.user_metadata);

      // Vérifier si l'email doit être confirmé
      if (!data.session) {
        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte avant de vous connecter.",
        });
        navigate('/login');
      } else {
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès.",
        });
        navigate('/profile');
      }

    } catch (error: any) {
      console.error("❌ Registration error:", error);
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { register, loading };
};
