
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const SocialLogin = () => {
  const { handleSocialLogin, loading } = useAuth();
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  
  const handleGoogleLogin = async () => {
    if (loading) return;
    
    setActiveProvider('google');
    try {
      console.log('Initiating Google login...');
      const success = await handleSocialLogin('google');
      if (!success) {
        setActiveProvider(null);
      }
      // Si success = true, l'utilisateur sera redirigé
    } catch (error) {
      console.error("Google login error:", error);
      setActiveProvider(null);
    }
  };

  const handleFacebookLogin = async () => {
    if (loading) return;
    
    setActiveProvider('facebook');
    try {
      console.log('Initiating Facebook login...');
      const success = await handleSocialLogin('facebook');
      if (!success) {
        setActiveProvider(null);
      }
    } catch (error) {
      console.error("Facebook login error:", error);
      setActiveProvider(null);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex items-center justify-center gap-2 relative"
      >
        {activeProvider === 'google' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        <span className={activeProvider === 'google' ? 'ml-2' : ''}>
          Google
        </span>
      </Button>
      
      <Button
        type="button"
        variant="outline"
        onClick={handleFacebookLogin}
        disabled={loading}
        className="flex items-center justify-center gap-2 text-[#1877F2] relative"
      >
        {activeProvider === 'facebook' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/>
          </svg>
        )}
        <span className={activeProvider === 'facebook' ? 'ml-2' : ''}>
          Facebook
        </span>
      </Button>
    </div>
  );
};

export default SocialLogin;
