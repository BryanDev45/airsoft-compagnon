
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Lock, Check, AlertCircle } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const NewPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  
  const form = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Vérifie la force du mot de passe et met à jour les indicateurs
  const checkPasswordStrength = (password: string) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });
  };

  const onSubmit = (data: { password: string; confirmPassword: string }) => {
    console.log('New password set with token:', token);
    
    // Vérifier si le mot de passe correspond à tous les critères
    const allCriteriaMet = Object.values(passwordStrength).every(value => value === true);
    if (!allCriteriaMet) {
      toast({
        title: "Mot de passe trop faible",
        description: "Veuillez respecter tous les critères de sécurité",
        variant: "destructive",
      });
      return;
    }
    
    // Vérifier que les mots de passe correspondent
    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', {
        type: 'manual',
        message: 'Les mots de passe ne correspondent pas'
      });
      return;
    }
    
    // Simulated API call to set new password
    setTimeout(() => {
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été réinitialisé avec succès",
      });
      navigate('/login');
    }, 1500);
  };

  // Si pas de token dans l'URL, afficher un message d'erreur
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="max-w-md mx-auto">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Lien invalide</AlertTitle>
              <AlertDescription>
                Ce lien de réinitialisation est invalide ou a expiré. 
                Veuillez demander un nouveau lien de réinitialisation.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate('/reset-password')}
              className="w-full bg-airsoft-red hover:bg-red-700"
            >
              Demander un nouveau lien
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-1"
          style={{ 
            background: 'linear-gradient(45deg, #ff0000, #ff6b6b, #ff0000)',
            boxShadow: '0 4px 20px rgba(255, 0, 0, 0.2)'
          }}>
          <div className="bg-white p-7 rounded-lg">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Lock className="h-12 w-12 text-airsoft-red" />
              </div>
              <h1 className="text-2xl font-bold">Créer un nouveau mot de passe</h1>
              <p className="text-gray-600 mt-2">
                Choisissez un nouveau mot de passe sécurisé
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nouveau mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input 
                            placeholder="••••••••" 
                            className="pl-10" 
                            type="password" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              checkPasswordStrength(e.target.value);
                            }}
                            required 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                      
                      <div className="mt-3 space-y-2 text-sm">
                        <p className="font-medium text-gray-700">Votre mot de passe doit contenir :</p>
                        <ul className="space-y-1 pl-2">
                          <li className={`flex items-center ${passwordStrength.length ? 'text-green-600' : 'text-gray-500'}`}>
                            {passwordStrength.length ? <Check size={16} className="mr-1" /> : <span className="w-4 mr-1">-</span>}
                            Au moins 8 caractères
                          </li>
                          <li className={`flex items-center ${passwordStrength.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                            {passwordStrength.uppercase ? <Check size={16} className="mr-1" /> : <span className="w-4 mr-1">-</span>}
                            Au moins une majuscule
                          </li>
                          <li className={`flex items-center ${passwordStrength.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                            {passwordStrength.lowercase ? <Check size={16} className="mr-1" /> : <span className="w-4 mr-1">-</span>}
                            Au moins une minuscule
                          </li>
                          <li className={`flex items-center ${passwordStrength.number ? 'text-green-600' : 'text-gray-500'}`}>
                            {passwordStrength.number ? <Check size={16} className="mr-1" /> : <span className="w-4 mr-1">-</span>}
                            Au moins un chiffre
                          </li>
                          <li className={`flex items-center ${passwordStrength.special ? 'text-green-600' : 'text-gray-500'}`}>
                            {passwordStrength.special ? <Check size={16} className="mr-1" /> : <span className="w-4 mr-1">-</span>}
                            Au moins un caractère spécial
                          </li>
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
                      <FormLabel>Confirmez le mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input 
                            placeholder="••••••••" 
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

                <Button type="submit" className="w-full bg-airsoft-red hover:bg-red-700">
                  Réinitialiser mon mot de passe
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewPassword;
