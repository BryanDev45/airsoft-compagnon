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
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,}$/;

const registerSchema = z.object({
  username: z.string().min(3, {
    message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères.',
  }),
  firstname: z.string().min(2, {
    message: 'Le prénom doit contenir au moins 2 caractères.',
  }),
  lastname: z.string().min(2, {
    message: 'Le nom doit contenir au moins 2 caractères.',
  }),
  email: z.string().email({
    message: 'Veuillez entrer une adresse email valide.',
  }),
  birth_date: z.string().refine(value => {
    const date = new Date(value);
    const today = new Date();
    const ageDiff = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();
    
    // Calcul de l'âge réel (prend en compte les mois et jours)
    const age = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) 
      ? ageDiff - 1 
      : ageDiff;
      
    return age >= 18;
  }, {
    message: 'Vous devez avoir au moins 18 ans pour vous inscrire.',
  }),
  password: z.string()
    .min(6, {
      message: 'Le mot de passe doit contenir au moins 6 caractères.',
    })
    .refine(value => passwordRegex.test(value), {
      message: 'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial.',
    }),
  confirm_password: z.string(),
  terms: z.boolean().refine(value => value === true, {
    message: 'Vous devez accepter les conditions d\'utilisation.',
  }),
}).refine(data => data.password === data.confirm_password, {
  message: 'Les mots de passe ne correspondent pas.',
  path: ['confirm_password'],
});

export default function Register() {
  const { register, handleSocialLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      birth_date: '',
      password: '',
      confirm_password: '',
      terms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setLoading(true);
    try {
      // Préparation des données utilisateur pour l'inscription
      const userData = {
        username: values.username,
        firstname: values.firstname,
        lastname: values.lastname,
        birth_date: values.birth_date,
      };

      await register(values.email, values.password, userData);
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
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
            <h1 className="text-3xl font-bold text-gray-900">Créer un compte</h1>
            <p className="mt-2 text-sm text-gray-600">
              Rejoignez la communauté Airsoft Compagnon dès aujourd'hui
            </p>
          </div>

          <div className="mt-8">
            <div className="bg-white py-8 px-6 shadow rounded-lg border-2 border-airsoft-red">
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
                </TabsList>
                
                <TabsContent value="email">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstname"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prénom</FormLabel>
                              <FormControl>
                                <Input placeholder="Jean" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lastname"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom</FormLabel>
                              <FormControl>
                                <Input placeholder="Dupont" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom d'utilisateur</FormLabel>
                            <FormControl>
                              <Input placeholder="airsofter" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
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
                        name="birth_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date de naissance</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
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
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="••••••" 
                                type="password" 
                                autoComplete="new-password"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-gray-500 mt-1">
                              Le mot de passe doit contenir au minimum une minuscule, une majuscule, 
                              un chiffre et un caractère spécial.
                            </p>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="confirm_password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmer le mot de passe</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="••••••" 
                                type="password" 
                                autoComplete="new-password"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-normal">
                                J'accepte les{' '}
                                <Link to="/terms-of-use" className="text-airsoft-red hover:underline">
                                  conditions d'utilisation
                                </Link>
                                {' '}et la{' '}
                                <Link to="/privacy-policy" className="text-airsoft-red hover:underline">
                                  politique de confidentialité
                                </Link>
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-airsoft-red hover:bg-red-700"
                        disabled={loading}
                      >
                        {loading ? 'Inscription en cours...' : 'S\'inscrire'}
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
                  
                  <p className="mt-4 text-xs text-gray-500 text-center">
                    En vous inscrivant via un réseau social, vous acceptez nos{' '}
                    <Link to="/terms-of-use" className="text-airsoft-red hover:underline">
                      conditions d'utilisation
                    </Link>
                    {' '}et notre{' '}
                    <Link to="/privacy-policy" className="text-airsoft-red hover:underline">
                      politique de confidentialité
                    </Link>
                  </p>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6">
                <Separator className="my-4" />
                <p className="text-center text-sm">
                  Vous avez déjà un compte ?{' '}
                  <Link to="/login" className="font-medium text-airsoft-red hover:underline">
                    Se connecter
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
