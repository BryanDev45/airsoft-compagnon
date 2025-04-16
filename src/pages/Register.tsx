
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UserPlus, User, Lock, Mail, Check, Calendar, AlertCircle } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Register = () => {
  const navigate = useNavigate();
  const [isUnderAge, setIsUnderAge] = React.useState(false);
  const form = useForm({
    defaultValues: {
      firstname: '',
      lastname: '',
      birthdate: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const checkAge = (birthdate: string) => {
    if (!birthdate) return false;
    
    const today = new Date();
    const birthdateObj = new Date(birthdate);
    let age = today.getFullYear() - birthdateObj.getFullYear();
    const m = today.getMonth() - birthdateObj.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthdateObj.getDate())) {
      age--;
    }
    
    return age < 18;
  };

  const onSubmit = (data: any) => {
    console.log('Registration data:', data);
    
    // Validate age first
    const underAge = checkAge(data.birthdate);
    setIsUnderAge(underAge);
    
    if (underAge) {
      toast({
        title: "Inscription impossible",
        description: "Vous devez avoir au moins 18 ans pour vous inscrire",
        variant: "destructive",
      });
      return;
    }
    
    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', {
        type: 'manual',
        message: 'Les mots de passe ne correspondent pas'
      });
      return;
    }
    
    // Mock successful registration
    toast({
      title: "Inscription réussie",
      description: "Votre compte a été créé avec succès",
    });
    setTimeout(() => navigate('/profile'), 1000);
  };

  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('birthdate', value);
    
    // Check age whenever birthdate changes
    const underAge = checkAge(value);
    setIsUnderAge(underAge);
  };

  const handleFacebookRegistration = () => {
    console.log('Facebook registration attempt');
    // Mock Facebook OAuth registration
    toast({
      title: "Inscription avec Facebook",
      description: "Redirection vers Facebook...",
    });
    // In a real implementation, you would redirect to Facebook OAuth URL
    setTimeout(() => {
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec Facebook",
      });
      navigate('/profile');
    }, 2000);
  };

  const handleGoogleRegistration = () => {
    console.log('Google registration attempt');
    // Mock Google OAuth registration
    toast({
      title: "Inscription avec Google",
      description: "Redirection vers Google...",
    });
    // In a real implementation, you would redirect to Google OAuth URL
    setTimeout(() => {
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec Google",
      });
      navigate('/profile');
    }, 2000);
  };

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
              <h1 className="text-2xl font-bold">Inscription</h1>
              <p className="text-gray-600 mt-2">
                Créez votre compte pour rejoindre la communauté Airsoft Compagnon
              </p>
            </div>

            {isUnderAge && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Attention</AlertTitle>
                <AlertDescription>
                  Vous devez avoir au moins 18 ans pour vous inscrire sur Airsoft Compagnon.
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input placeholder="Votre nom" className="pl-10" {...field} required />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input placeholder="Votre prénom" className="pl-10" {...field} required />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="birthdate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de naissance</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input 
                            type="date" 
                            className={`pl-10 ${isUnderAge ? 'border-red-500 focus:border-red-500' : ''}`} 
                            {...field} 
                            onChange={handleBirthdateChange}
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
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom d'utilisateur</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input placeholder="Votre pseudo" className="pl-10" {...field} required />
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
                            placeholder="Créez un mot de passe fort" 
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmez le mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="agree-terms" 
                    className="rounded border-gray-300 text-airsoft-red focus:ring-airsoft-red"
                    required
                  />
                  <label htmlFor="agree-terms" className="text-sm text-gray-600">
                    J'accepte les <Link to="/terms-of-use" className="text-airsoft-red hover:underline">conditions d'utilisation</Link>
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-airsoft-red hover:bg-red-700"
                  disabled={isUnderAge}
                >
                  <UserPlus className="mr-2 h-4 w-4" /> S'inscrire
                </Button>
              </form>
            </Form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">Ou</span>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full flex justify-center"
                onClick={handleGoogleRegistration}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path 
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
                    fill="#4285F4" 
                  />
                  <path 
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
                    fill="#34A853" 
                  />
                  <path 
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
                    fill="#FBBC05" 
                  />
                  <path 
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
                    fill="#EA4335" 
                  />
                </svg>
                S'inscrire avec Google
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full flex justify-center"
                onClick={handleFacebookRegistration}
              >
                <svg className="mr-2 h-4 w-4" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                S'inscrire avec Facebook
              </Button>
            </div>

            <p className="text-center mt-8 text-sm text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-airsoft-red font-semibold hover:underline">
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
