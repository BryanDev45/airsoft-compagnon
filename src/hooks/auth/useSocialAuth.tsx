
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

export const useSocialAuth = () => {
  const [loading, setLoading] = useState(false);

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    try {
      setLoading(true);
      console.log(`Attempting ${provider} authentication`);
      
      // Générer l'URL de redirection
      const redirectTo = `${window.location.origin}/profile`;
      
      const authOptions = {
        redirectTo: redirectTo,
        queryParams: provider === 'google' ? {
          access_type: 'offline',
          prompt: 'consent',
        } : {
          // Facebook spécifique
          scope: 'email,public_profile'
        }
      };

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: authOptions
      });

      if (error) {
        console.error(`${provider} auth error:`, error);
        toast({
          title: "Erreur d'authentification",
          description: error.message || `Problème lors de la connexion avec ${provider}`,
          variant: "destructive",
        });
        return false;
      }
      
      console.log(`${provider} auth data:`, data);
      
      // Si on reçoit une URL, l'utilisateur sera redirigé automatiquement
      if (data?.url) {
        console.log(`Redirecting to ${provider} auth URL`);
        window.location.href = data.url;
      }
      
      return true;
    } catch (error: any) {
      console.error(`${provider} auth error:`, error);
      toast({
        title: "Erreur d'authentification",
        description: error.message || `Une erreur est survenue lors de la connexion avec ${provider}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSocialAuth
  };
};
