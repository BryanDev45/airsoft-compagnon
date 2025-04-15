
import React from 'react';
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative bg-airsoft-dark text-white overflow-hidden clip-bottom">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-80"></div>
        <img 
          src="https://images.unsplash.com/photo-1576315587309-bf12c9823875?q=80&w=2658&auto=format&fit=crop" 
          alt="Airsoft background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="max-w-3xl">
          <div className="mb-8">
            <img
              src="/lovable-uploads/1cc60b94-2b6c-4e0e-9ab8-1bd1e8cb1098.png"
              alt="Airsoft Compagnon Logo"
              className="h-24 md:h-32 mb-6"
            />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              AIRSOFT<br/>COMPAGNON
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Trouvez facilement vos parties d'airsoft en un seul clic,
              où même les magasins autour de vous.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="bg-airsoft-red hover:bg-red-700 text-white px-8 py-6 text-lg rounded-none" 
              size="lg"
            >
              Nous rejoindre
            </Button>
            <div className="flex gap-4">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-none">
                App Store
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-none">
                Google Play
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
