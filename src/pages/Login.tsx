import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';

const loginSchema = z.object({
  email: z.string().email({
    message: 'Veuillez entrer une adresse email valide.',
  }),
  password: z.string().min(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères.',
  }),
  rememberMe: z.boolean().optional()
});

export default function Login() {
  const { login, handleSocialLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      await login(values.email, values.password, values.rememberMe);
    } catch (error) {
      console.error('Erreur de connexion:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Connexion</h1>
            <p className="mt-2 text-sm text-gray-600">
              Connectez-vous pour accéder à votre compte Airsoft Compagnon
            </p>
          </div>

          <div className="mt-8">
            <div className="bg-white py-8 px-6 shadow rounded-lg">
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
                </TabsList>
                
                <TabsContent value="email">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="votre@email.com" 
                                type="email" 
                                autoComplete="email"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between items-center">
                              <FormLabel>Mot de passe</FormLabel>
                              <Link 
                                to="/reset-password" 
                                className="text-xs text-airsoft-red hover:underline"
                              >
                                Mot de passe oublié ?
                              </Link>
                            </div>
                            <FormControl>
                              <Input 
                                placeholder="••••••" 
                                type="password" 
                                autoComplete="current-password"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Rester connecté</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-airsoft-red hover:bg-red-700"
                        disabled={loading}
                      >
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="social">
                  <div className="space-y-4">
                    <Button 
                      onClick={() => handleSocialLogin('google')}
                      className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
                      type="button"
                    >
                      <img src="/lovable-uploads/24d6452d-2439-4baf-b334-41863a1077c5.png" alt="Google" className="w-5 h-5 mr-2" />
                      Continuer avec Google
                    </Button>
                    
                    <Button 
                      onClick={() => handleSocialLogin('facebook')}
                      className="w-full bg-[#1877F2] hover:bg-[#0c5dc7] flex items-center justify-center"
                      type="button"
                    >
                      <img src="/lovable-uploads/c242d3b0-8906-4f00-9b3b-fc251f703e4b.png" alt="Facebook" className="w-5 h-5 mr-2" />
                      Continuer avec Facebook
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6">
                <Separator className="my-4" />
                <p className="text-center text-sm">
                  Vous n'avez pas de compte ?{' '}
                  <Link to="/register" className="font-medium text-airsoft-red hover:underline">
                    Créer un compte
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
