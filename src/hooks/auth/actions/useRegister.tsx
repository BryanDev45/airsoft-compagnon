
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

      // Préparer les métadonnées utilisateur avec les bonnes clés
      const userMetadata = {
        username: userData.username,
        firstname: userData.firstname,
        lastname: userData.lastname,
        birth_date: userData.birth_date,
        // Ajout des clés alternatives pour compatibility
        first_name: userData.firstname,
        last_name: userData.lastname
      };

      console.log('Données d\'inscription envoyées:', userMetadata);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata,
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error("Erreur lors de la création du compte");

      console.log('Utilisateur créé:', data.user);
      console.log('Métadonnées utilisateur:', data.user.user_metadata);

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

  return { register, loading };
};
