
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { FaGoogle, FaFacebook } from 'react-icons/fa';

const loginSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  rememberMe: z.boolean().optional(),
});

const Login = () => {
  const { login, handleSocialLogin, loading } = useAuth();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  
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
    await login(data.email, data.password, rememberMe);
  };

  const handleGoogleLogin = async () => {
    await handleSocialLogin('google');
  };

  const handleFacebookLogin = async () => {
    await handleSocialLogin('facebook');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Connexion</h2>
            <p className="mt-2 text-sm text-gray-600">
              Ou{' '}
              <Link to="/register" className="font-medium text-airsoft-red hover:text-red-500">
                créez un compte
              </Link>
            </p>
          </div>
          
          <form 
            className="mt-8 space-y-6 animate-[pulse_1s_ease-in-out_infinite] border-2 border-airsoft-red rounded-lg p-8 shadow-md transition-all hover:shadow-lg"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
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
                  <Link to="/forgot-password" className="text-sm text-airsoft-red hover:text-red-500">
                    Mot de passe oublié?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
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
                />
                <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                  Se souvenir de moi
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-airsoft-red hover:bg-red-700"
              disabled={loading}
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
            
            <Separator className="my-4">
              <span className="px-2 text-xs text-gray-500">OU</span>
            </Separator>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="flex items-center justify-center"
              >
                <FaGoogle className="mr-2" />
                Google
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleFacebookLogin}
                disabled={loading}
                className="flex items-center justify-center"
              >
                <FaFacebook className="mr-2" />
                Facebook
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
