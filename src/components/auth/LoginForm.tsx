
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  rememberMe: z.boolean().optional(),
});

const LoginForm = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    if (isSubmitting || loading) {
      console.log("🚫 Form submission blocked - already submitting");
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log("📝 Form submitted, attempting login");
      
      const success = await login(data.email, data.password, rememberMe);
      
      if (success) {
        console.log("✅ Login successful, form will let auth system handle redirect");
        // Let the auth system handle the redirect
        // Don't set isSubmitting to false here as we're redirecting
      } else {
        console.log("❌ Login failed");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("❌ Login submission error:", error);
      setIsSubmitting(false);
      toast({
        title: "Erreur de connexion",
        description: "Une erreur inattendue est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  // Combine loading states to show loader when either local state or auth state is loading
  const showLoader = isSubmitting || loading;

  return (
    <form 
      className="mt-8 space-y-6 border-2 border-airsoft-red rounded-lg p-8 shadow-md transition-all hover:shadow-lg"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            disabled={showLoader}
            {...register('email')}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mot de passe</Label>
            <Link to="/reset-password" className="text-sm text-airsoft-red hover:text-red-500">
              Mot de passe oublié?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            disabled={showLoader}
            {...register('password')}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>
        
        <div className="flex items-center">
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(!!checked)}
            disabled={showLoader}
          />
          <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
            Se souvenir de moi
          </Label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-airsoft-red hover:bg-red-700"
        disabled={showLoader}
      >
        {showLoader ? (
          <span className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connexion en cours...
          </span>
        ) : (
          "Se connecter"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
