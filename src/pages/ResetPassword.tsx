
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Check, ArrowLeft, KeyRound } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [emailSent, setEmailSent] = useState(false);
  
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const requestResetForm = useForm({
    defaultValues: {
      email: '',
    }
  });

  const handleRequestReset = (data: { email: string }) => {
    console.log('Password reset requested for:', data.email);
    
    // Mock sending password reset email
    toast({
      title: "Email envoyé",
      description: "Consultez votre boîte mail pour réinitialiser votre mot de passe",
    });
    
    setEmailSent(true);
  };

  const handleResetPassword = (data: { password: string, confirmPassword: string }) => {
    console.log('Resetting password with token:', token);
    
    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', {
        type: 'manual',
        message: 'Les mots de passe ne correspondent pas'
      });
      return;
    }
    
    // Mock successful password reset
    toast({
      title: "Mot de passe réinitialisé",
      description: "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe",
    });
    
    setTimeout(() => navigate('/login'), 2000);
  };

  if (!token) {
    // Step 1: Request password reset email
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
                <div className="flex justify-center mb-2">
                  <img
                    src="/lovable-uploads/5c383bd0-1652-45d0-8623-3f4ef3653ec8.png"
                    alt="Logo"
                    className="h-16"
                  />
                </div>
                <h1 className="text-2xl font-bold">Mot de passe oublié</h1>
                <p className="text-gray-600 mt-2">
                  {emailSent 
                    ? "Vérifiez votre boîte mail pour réinitialiser votre mot de passe" 
                    : "Entrez votre adresse email pour réinitialiser votre mot de passe"}
                </p>
              </div>

              {emailSent ? (
                <div className="text-center space-y-6">
                  <Alert className="bg-green-50 border-green-200">
                    <Check className="h-4 w-4 text-green-500" />
                    <AlertTitle>Email envoyé</AlertTitle>
                    <AlertDescription>
                      Nous avons envoyé un lien de réinitialisation à votre adresse email.
                      Veuillez vérifier votre boîte de réception et suivre les instructions.
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setEmailSent(false)}
                  >
                    Renvoyer l'email
                  </Button>
                  
                  <div>
                    <Link to="/login" className="text-airsoft-red hover:underline inline-flex items-center">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Retour à la connexion
                    </Link>
                  </div>
                </div>
              ) : (
                <Form {...requestResetForm}>
                  <form onSubmit={requestResetForm.handleSubmit(handleRequestReset)} className="space-y-6">
                    <FormField
                      control={requestResetForm.control}
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
                    
                    <Button type="submit" className="w-full bg-airsoft-red hover:bg-red-700">
                      Réinitialiser le mot de passe
                    </Button>
                    
                    <div className="text-center">
                      <Link to="/login" className="text-airsoft-red hover:underline inline-flex items-center">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour à la connexion
                      </Link>
                    </div>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Step 2: Create new password (when token is present in URL)
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
              <div className="flex justify-center mb-2">
                <img
                  src="/lovable-uploads/5c383bd0-1652-45d0-8623-3f4ef3653ec8.png"
                  alt="Logo"
                  className="h-16"
                />
              </div>
              <h1 className="text-2xl font-bold">Créer un nouveau mot de passe</h1>
              <p className="text-gray-600 mt-2">
                Entrez et confirmez votre nouveau mot de passe
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleResetPassword)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nouveau mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input 
                            placeholder="Créez un mot de passe fort" 
                            className="pl-10" 
                            type="password" 
                            {...field} 
                            required 
                          />
                        </div>
                      </FormControl>
                      <p className="text-xs text-gray-500 mt-1">
                        Le mot de passe doit contenir au moins 8 caractères, incluant une majuscule, 
                        une minuscule, un chiffre et un caractère spécial.
                      </p>
                      <FormMessage />
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
                          <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input 
                            placeholder="Répétez votre mot de passe" 
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
                  Réinitialiser le mot de passe
                </Button>
                
                <div className="text-center">
                  <Link to="/login" className="text-airsoft-red hover:underline inline-flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour à la connexion
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
