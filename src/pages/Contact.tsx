import React from 'react';
import { useForm } from 'react-hook-form';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Users } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const Contact = () => {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = (data: any) => {
    console.log(data);
    toast({
      title: "Message envoyé",
      description: "Nous vous répondrons dans les plus brefs délais."
    });
    form.reset();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="relative bg-airsoft-dark text-white py-16 mb-12">
          <div className="absolute inset-0 overflow-hidden">
            <img src="/lovable-uploads/ae8f6590-a316-4f3b-a876-7ed8bdc03246.png" alt="Background" className="w-full h-full object-cover opacity-30" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contactez-nous</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Notre équipe est à votre disposition pour répondre à toutes vos questions.
            </p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid md:grid-cols-2 gap-8 mb-12 justify-center">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-airsoft-red flex items-center justify-center mb-4 text-white">
                  <Mail className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-xl mb-2">Email</h3>
                <p className="text-gray-600 mb-4">N'hésitez pas à nous écrire</p>
                <a href="mailto:contact@airsoftcompagnon.fr" className="text-airsoft-red hover:underline font-medium">
                  contact@airsoftcompagnon.fr
                </a>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-airsoft-red flex items-center justify-center mb-4 text-white">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-xl mb-2">Réseaux sociaux</h3>
                <p className="text-gray-600 mb-4">Suivez-nous</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-600 hover:text-airsoft-red transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.883 4.883 0 01-1.153 1.772c-.5.509-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-airsoft-red transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5 902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.509-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />
                    </svg>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="name" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre nom" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    
                    <FormField control={form.control} name="email" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Votre email" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>
                  
                  <FormField control={form.control} name="subject" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Sujet</FormLabel>
                        <FormControl>
                          <Input placeholder="Sujet de votre message" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                  
                  <FormField control={form.control} name="message" render={({
                  field
                }) => <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <textarea className="flex min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Votre message" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>} />
                  
                  <Button type="submit" className="w-full bg-airsoft-red hover:bg-red-700 transition-colors">
                    <Send className="mr-2 h-5 w-5" /> Envoyer le message
                  </Button>
                </form>
              </Form>
            </div>
            
            <div className="bg-airsoft-dark text-white rounded-lg shadow-md p-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <img src="/lovable-uploads/c7db344c-5322-45a9-9666-3b984775e92c.jpg" alt="Background pattern" className="w-full h-full object-cover" />
              </div>
              <div className="relative">
                <h2 className="text-2xl font-bold mb-6">Foire aux questions</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <MessageSquare className="mr-2 h-5 w-5" /> Comment créer un compte ?
                    </h3>
                    <p className="text-gray-300">Rendez-vous sur la page d'inscription et remplissez le formulaire avec vos informations personnelles.</p>
                  </div>
                  
                  <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <MessageSquare className="mr-2 h-5 w-5" /> Comment créer une partie d'airsoft ?
                    </h3>
                    <p className="text-gray-300">Connectez-vous à votre compte, accédez à la section "Parties" et cliquez sur "Créer une partie".</p>
                  </div>
                  
                  <div className="mt-8">
                    <Button variant="outline" className="w-full bg-airsoft-red hover:bg-red-700 text-white border-white" asChild>
                      <a href="/faq">
                        Voir toutes les questions fréquentes
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
