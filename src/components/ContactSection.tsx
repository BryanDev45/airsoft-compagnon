
import React, { useState } from 'react';
import { Facebook, Instagram, Mail, MessageSquare, Download, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';

const ContactSection = () => {
  const { user } = useAuth();
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleInstallPWA = () => {
    toast({
      title: "Installation PWA",
      description: "Pour installer l'application, utilisez le menu de votre navigateur et sélectionnez 'Ajouter à l'écran d'accueil'",
    });
  };

  const handleNewsletterSubscription = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour vous inscrire à la newsletter",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubscribing(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ newsletter_subscribed: true })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Inscription réussie",
        description: "Vous êtes maintenant inscrit à la newsletter",
      });
    } catch (error: any) {
      console.error("Error subscribing to newsletter:", error);
      toast({
        title: "Erreur",
        description: "Impossible de vous inscrire à la newsletter",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mb-16">
      <div className="bg-airsoft-dark text-white p-6 md:p-10 rounded-lg relative overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform">
        <div className="absolute inset-0 bg-gradient-to-br from-airsoft-dark via-airsoft-dark to-airsoft-dark/70 z-0"></div>
        <div className="absolute inset-0">
          <img 
            src="/lovable-uploads/ae8f6590-a316-4f3b-a876-7ed8bdc03246.png" 
            alt="Joueurs d'airsoft tactiques avec vision nocturne" 
            className="object-cover w-full h-full opacity-30"
          />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-block bg-airsoft-red px-4 py-1 rounded-full mb-4">
            <Users className="inline-block mr-2 h-5 w-5 text-white" />
            <span className="text-white font-semibold">Rejoignez-nous</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Où nous retrouver ?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl">
            Retrouvez-nous sur les réseaux sociaux avec Facebook et Instagram afin d'être au courant des dernières actualités et de ne rien louper.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              onClick={handleInstallPWA}
              variant="outline" 
              className="bg-airsoft-red hover:bg-red-700 text-white border-white hover:bg-white hover:text-airsoft-red transition-colors flex items-center gap-2"
            >
              <Download size={20} />
              Installer l'application (PWA)
            </Button>
            <Button 
              onClick={handleNewsletterSubscription}
              disabled={isSubscribing}
              variant="outline" 
              className="bg-blue-600 hover:bg-blue-700 text-white border-white hover:bg-blue-800 transition-colors flex items-center gap-2"
            >
              <Mail size={20} />
              {isSubscribing ? "Inscription..." : "S'inscrire à la newsletter"}
            </Button>
            <a href="#" className="bg-airsoft-dark text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition-colors border border-white/20">
              <Facebook size={20} />
              Facebook
            </a>
            <a href="#" className="bg-airsoft-dark text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition-colors border border-white/20">
              <Instagram size={20} />
              Instagram
            </a>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button className="bg-airsoft-red text-white hover:bg-red-700 border border-white">
                <Mail className="mr-2" size={18} />
                Nous contacter
              </Button>
            </Link>
            <Link to="/faq">
              <Button className="bg-airsoft-red text-white hover:bg-red-700 border border-white">
                <MessageSquare className="mr-2" size={18} />
                FAQ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
