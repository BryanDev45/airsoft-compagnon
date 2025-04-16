
import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = (data: { email: string; password: string; remember: boolean }) => {
    console.log('Login attempt with:', data);
    
    // Simulated API call for login
    setTimeout(() => {
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur Airsoft Compagnon",
      });
      // In a real application, you would store the authentication token
      // and redirect the user to the home page or dashboard
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex justify-center mb-6">
                <img 
                  src="/lovable-uploads/5c383bd0-1652-45d0-8623-3f4ef3653ec8.png" 
                  alt="Airsoft Compagnon" 
                  className="h-20 w-auto" 
                />
              </div>
              
              <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input 
                              placeholder="votre@email.com" 
                              className="pl-10" 
                              type="email" 
                              {...field} 
                              required 
                            />
                          </div>
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
                        <div className="flex items-center justify-between">
                          <FormLabel>Mot de passe</FormLabel>
                          <Link to="/reset-password" className="text-xs text-airsoft-red hover:underline">
                            Mot de passe oublié?
                          </Link>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input 
                              placeholder="Votre mot de passe" 
                              className="pl-10" 
                              type="password" 
                              {...field} 
                              required 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="remember"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Se souvenir de moi</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full bg-airsoft-red hover:bg-red-700">
                    Se connecter <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  Pas encore de compte?{" "}
                  <Link to="/register" className="text-airsoft-red hover:underline font-medium">
                    S'inscrire
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
};

export default Login;
