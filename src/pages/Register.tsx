
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z.object({
  firstname: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastname: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  email: z.string().email("L'adresse email n'est pas valide"),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: "Vous devez accepter les conditions d'utilisation",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Register attempt with:', data);
    
    // Simulated API call for registration
    setTimeout(() => {
      toast({
        title: "Inscription réussie",
        description: "Bienvenue sur Airsoft Compagnon",
      });
      // In a real application, you would redirect the user to the login page
      // or automatically log them in
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex justify-center mb-6">
                <img 
                  src="/lovable-uploads/5c383bd0-1652-45d0-8623-3f4ef3653ec8.png" 
                  alt="Airsoft Compagnon" 
                  className="h-20 w-auto" 
                />
              </div>
              
              <h1 className="text-2xl font-bold text-center mb-6">Inscription</h1>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                              <Input 
                                placeholder="Votre prénom" 
                                className="pl-10" 
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
                      name="lastname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                              <Input 
                                placeholder="Votre nom" 
                                className="pl-10" 
                                {...field} 
                                required 
                              />
                            </div>
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
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input 
                              placeholder="Votre nom d'utilisateur" 
                              className="pl-10" 
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
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input 
                              placeholder="Votre mot de passe" 
                              className="pl-10 pr-10" 
                              type={showPassword ? "text" : "password"} 
                              {...field} 
                              required 
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                        <div className="text-xs text-gray-500 mt-2">
                          <p>Le mot de passe doit contenir au moins:</p>
                          <ul className="list-disc list-inside mt-1">
                            <li>8 caractères</li>
                            <li>Une lettre majuscule</li>
                            <li>Une lettre minuscule</li>
                            <li>Un chiffre</li>
                            <li>Un caractère spécial</li>
                          </ul>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input 
                              placeholder="Confirmez votre mot de passe" 
                              className="pl-10 pr-10" 
                              type={showConfirmPassword ? "text" : "password"} 
                              {...field} 
                              required 
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm text-gray-600">
                            J'accepte les{" "}
                            <Link to="/terms-of-use" className="text-airsoft-red hover:underline">
                              conditions d'utilisation
                            </Link>
                            {" "}et la{" "}
                            <Link to="/privacy-policy" className="text-airsoft-red hover:underline">
                              politique de confidentialité
                            </Link>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full bg-airsoft-red hover:bg-red-700 mt-6">
                    Créer mon compte
                  </Button>
                </form>
              </Form>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  Déjà un compte?{" "}
                  <Link to="/login" className="text-airsoft-red hover:underline font-medium">
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
};

export default Register;
