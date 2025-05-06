
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const MapSectionHeader: React.FC = () => {
  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
          <span className="relative z-10">Trouvez votre prochaine partie</span>
          <span className="absolute bottom-0 left-0 w-full h-2 bg-airsoft-red/20 -z-0"></span>
        </h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
          Des centaines de parties d'airsoft près de chez vous
        </p>
      </div>
      
      <div className="flex justify-end mb-6">
        <Link to="/parties/create">
          <Button className="bg-airsoft-red hover:bg-red-700 shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Créer une partie
          </Button>
        </Link>
      </div>
    </>
  );
};

export default MapSectionHeader;
