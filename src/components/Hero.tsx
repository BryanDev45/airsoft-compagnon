
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Hero = () => {
  const { user } = useAuth();
  
  return (
    <div className="relative bg-airsoft-dark text-white overflow-hidden clip-bottom">
      <div className="absolute inset-0 z-0">
        <img src="/lovable-uploads/e3177716-6012-4386-a9b2-607ab6f838b0.png" alt="Airsoft background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-white opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-50"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 lg:py-16 md:py-[80px] pb-16 md:pb-[80px]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <img src="/lovable-uploads/24d6452d-2439-4baf-b334-41863a1077c5.png" alt="Airsoft Compagnon Logo" className="h-30 md:h-38 mb-6 mx-auto" />
            <p className="text-lg md:text-xl mb-8">
              Trouvez facilement vos parties d'airsoft en un seul clic,
              où même les magasins autour de vous.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 sm:mb-8">
            <Link to={user ? "/profile" : "/register"}>
              <Button className="bg-airsoft-red hover:bg-red-700 text-white px-8 py-6 text-lg rounded-md shadow-lg transform transition-transform hover:scale-105" size="lg">
                {user ? "Mon profil" : "Nous rejoindre"} <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Button variant="outline" className="bg-airsoft-red hover:bg-red-700 text-white px-8 py-6 text-lg rounded-md shadow-lg transform transition-transform hover:scale-105" size="lg">
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
