
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative bg-airsoft-dark text-white overflow-hidden clip-bottom">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-70"></div>
        <img 
          src="/lovable-uploads/e3177716-6012-4386-a9b2-607ab6f838b0.png" 
          alt="Airsoft background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <img
              src="/lovable-uploads/24d6452d-2439-4baf-b334-41863a1077c5.png"
              alt="Airsoft Compagnon Logo"
              className="h-24 md:h-32 mb-6 mx-auto"
            />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              AIRSOFT<br/>COMPAGNON
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Trouvez facilement vos parties d'airsoft en un seul clic,
              où même les magasins autour de vous.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button 
                className="bg-airsoft-red hover:bg-red-700 text-white px-8 py-6 text-lg rounded-md shadow-lg transform transition-transform hover:scale-105" 
                size="lg"
              >
                Nous rejoindre <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-red-700 rounded-md flex items-center gap-2 shadow-lg transition-all hover:border-airsoft-red"
            >
              <Download size={20} />
              Installer l'application (PWA)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
