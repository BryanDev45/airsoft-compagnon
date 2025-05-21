
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useSocialAuth = () => {
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleSocialAuth: handleSocialLogin };
};
