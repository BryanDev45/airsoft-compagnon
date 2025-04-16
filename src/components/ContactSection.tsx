
import React from 'react';
import { Facebook, Instagram, Mail, MessageSquare, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const ContactSection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-airsoft-red text-white p-8 md:p-12 rounded-lg overflow-hidden relative">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-black/20 to-transparent"></div>
          
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">Où nous retrouver ?</h2>
            <p className="text-lg mb-8">
              Retrouvez-nous sur les réseaux sociaux avec Facebook et Instagram afin d'être au courant des dernières actualités et de ne rien louper.
            </p>
            
            <div className="flex flex-wrap gap-6">
              <Button 
                variant="outline" 
                className="bg-airsoft-red hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2 border-white hover:bg-white hover:text-airsoft-red transition-colors"
              >
                <Download size={20} />
                Installer l'application (PWA)
              </Button>
              <a href="#" className="bg-airsoft-dark text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition-colors">
                <Facebook size={20} />
                Facebook
              </a>
              <a href="#" className="bg-airsoft-dark text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800 transition-colors">
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
              <Button className="bg-airsoft-red text-white hover:bg-red-700 border border-white">
                <MessageSquare className="mr-2" size={18} />
                FAQ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
