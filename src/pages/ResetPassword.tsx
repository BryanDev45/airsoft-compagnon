
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ResetPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const form = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: { email: string }) => {
    console.log('Reset password request for:', data.email);
    
    // Simulated API call for password reset
    setTimeout(() => {
      toast({
        title: "Demande envoyée",
        description: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation",
      });
      setEmailSent(true);
    }, 1500);
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
              <div className="flex justify-center mb-4">
                <Mail className="h-12 w-12 text-airsoft-red" />
              </div>
              <h1 className="text-2xl font-bold">Mot de passe oublié</h1>
              <p className="text-gray-600 mt-2">
                Entrez votre email pour recevoir un lien de réinitialisation
              </p>
            </div>

            {emailSent ? (
              <div className="space-y-6">
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription>
                    Un email a été envoyé avec les instructions pour réinitialiser votre mot de passe. 
                    Veuillez vérifier votre boîte de réception.
                  </AlertDescription>
                </Alert>
                <Link to="/login">
                  <Button className="w-full" variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la connexion
                  </Button>
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                  <div className="space-y-4">
                    <Button type="submit" className="w-full bg-airsoft-red hover:bg-red-700">
                      <Send className="mr-2 h-4 w-4" /> Envoyer le lien
                    </Button>
                    
                    <Link to="/login">
                      <Button className="w-full" variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la connexion
                      </Button>
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
};

export default ResetPassword;
