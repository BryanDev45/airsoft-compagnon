
import React from 'react';
import { Facebook, Instagram, Mail, MessageSquare, Download, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const ContactSection = () => {
  return (
    <div className="bg-airsoft-dark text-white p-6 md:p-10 rounded-lg mb-8 relative overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform">
      <div className="absolute inset-0 bg-gradient-to-br from-airsoft-dark via-airsoft-dark to-airsoft-dark/70 z-0"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-full">
        <img 
          src="/lovable-uploads/ae8f6590-a316-4f3b-a876-7ed8bdc03246.png" 
          alt="Joueurs d'airsoft tactiques avec vision nocturne" 
          className="object-cover h-full w-full opacity-50 mix-blend-overlay"
        />
      </div>
      
      <div className="relative z-10">
        <div className="inline-block bg-airsoft-red px-4 py-1 rounded-full mb-4">
          <Users className="inline-block mr-2 h-5 w-5 text-white" />
          <span className="text-white font-semibold">Rejoignez-nous</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Où nous retrouver ?</h2>
        <p className="text-lg mb-8 opacity-90">
          Retrouvez-nous sur les réseaux sociaux avec Facebook et Instagram afin d'être au courant des dernières actualités et de ne rien louper.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <Button 
            variant="outline" 
            className="bg-airsoft-red hover:bg-red-700 text-white border-white hover:bg-white hover:text-airsoft-red transition-colors flex items-center gap-2"
          >
            <Download size={20} />
            Installer l'application (PWA)
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
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
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
  );
};

export default ContactSection;
