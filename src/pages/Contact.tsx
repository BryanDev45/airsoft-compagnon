import React from 'react';
import { useForm } from 'react-hook-form';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Users, Facebook, Instagram } from 'lucide-react';
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
    
    // Créer le lien mailto avec la nouvelle adresse
    const subject = encodeURIComponent(`Contact: ${data.subject}`);
    const body = encodeURIComponent(
      `Nom: ${data.name}\n` +
      `Email: ${data.email}\n\n` +
      `Message:\n${data.message}`
    );
    
    // Ouvrir le client email avec l'adresse support@airsoft-companion.com
    window.open(`mailto:support@airsoft-companion.com?subject=${subject}&body=${body}`);
    
    toast({
      title: "Message préparé",
      description: "Votre client email s'est ouvert avec le message pré-rempli."
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
                <a href="mailto:support@airsoft-companion.com" className="text-airsoft-red hover:underline font-medium">
                  support@airsoft-companion.com
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
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-airsoft-red transition-colors">
                    <Instagram className="w-6 h-6" />
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
