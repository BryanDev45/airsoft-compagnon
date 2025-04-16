
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

npm install --save styled-jsx
npm install --save-dev @types/styled-jsx

const Hero = () => {
  return <div className="relative bg-airsoft-dark text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/lovable-uploads/e3177716-6012-4386-a9b2-607ab6f838b0.png" alt="Airsoft background" className="w-full h-full object-cover" />
        {/* Calque blanc semi-transparent par-dessus l'image */}
        <div className="absolute inset-0 bg-white opacity-50"></div>
        {/* Dégradé noir */}
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-50"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 lg:py-12 md:py-[60px]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <img src="/lovable-uploads/24d6452d-2439-4baf-b334-41863a1077c5.png" alt="Airsoft Compagnon Logo" className="h-30 md:h-38 mb-6 mx-auto" />
            <p className="text-lg md:text-xl mb-8">
              Trouvez facilement vos parties d'airsoft en un seul clic,
              où même les magasins autour de vous.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button className="bg-airsoft-red hover:bg-red-700 text-white px-8 py-6 text-lg rounded-md shadow-lg transform transition-transform hover:scale-105" size="lg">
                Nous rejoindre <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Button variant="outline" className="bg-airsoft-red hover:bg-red-700 text-white px-8 py-6 text-lg rounded-md shadow-lg transform transition-transform hover:scale-105" size="lg">
              <Download size={20} />
              Installer l'application (PWA)
            </Button>
          </div>
        </div>
      </div>
      
      {/* V-shape with gradient border */}
      <div className="v-shape-container">
        <div className="v-shape"></div>
      </div>

      <style jsx>{`
        .v-shape-container {
          position: relative;
          height: 60px;
          width: 100%;
          overflow: hidden;
        }
        .v-shape {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          clip-path: polygon(0 0, 50% 100%, 100% 0);
          background: linear-gradient(to right, #ea384c, #ff6b6b);
        }
      `}</style>
    </div>;
};

export default Hero;
