
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  return (
    <div className="relative bg-airsoft-dark text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/e3177716-6012-4386-a9b2-607ab6f838b0.png" 
          alt="Airsoft background" 
          className="w-full h-full object-cover animate-fade-in"
        />
        <div className="absolute inset-0 bg-white opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-50" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 lg:py-12 md:py-[60px] animate-fade-in">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8 animate-scale-in">
            <img 
              src="/lovable-uploads/24d6452d-2439-4baf-b334-41863a1077c5.png" 
              alt="Airsoft Compagnon Logo" 
              className="h-30 md:h-38 mb-6 mx-auto hover:scale-105 transition-transform duration-300"
            />
            <p className="text-lg md:text-xl mb-8 opacity-0 animate-[fade-in_0.5s_ease-out_0.3s_forwards]">
              Trouvez facilement vos parties d'airsoft en un seul clic,
              où même les magasins autour de vous.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to={isAuthenticated ? "/profile" : "/register"}>
              <Button 
                className="bg-airsoft-red hover:bg-red-700 text-white px-8 py-6 text-lg rounded-md shadow-lg transform transition-all duration-300 hover:scale-105 opacity-0 animate-[fade-in_0.5s_ease-out_0.6s_forwards]" 
                size="lg"
              >
                {isAuthenticated ? "Mon profil" : "Nous rejoindre"} <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="bg-airsoft-red hover:bg-red-700 text-white px-8 py-6 text-lg rounded-md shadow-lg transform transition-all duration-300 hover:scale-105 opacity-0 animate-[fade-in_0.5s_ease-out_0.9s_forwards]" 
              size="lg"
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
