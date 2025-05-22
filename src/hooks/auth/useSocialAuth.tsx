
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

export const useSocialAuth = () => {
  const [loading, setLoading] = useState(false);

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    try {
      setLoading(true);
      
      // Set redirect URL
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/profile`,
        }
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
      
      // No need to manually redirect as Supabase handles this
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
