
import React from 'react';
import Header from '../components/Header';
import MapSection from '../components/MapSection';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Parties = () => {
  const navigate = useNavigate();

  const handleCreateParty = () => {
    // Dans une version future, ceci naviguerait vers un formulaire de création
    // Pour l'instant, simulons juste la navigation
    console.log("Création d'une nouvelle partie");
    // navigate('/parties/create');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Parties d'airsoft</h1>
              <p className="text-gray-600">
                Trouvez et rejoignez des parties d'airsoft près de chez vous
              </p>
            </div>
            <Button 
              onClick={handleCreateParty} 
              className="bg-airsoft-red hover:bg-red-700 text-white"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Créer une partie
            </Button>
          </div>
        </div>
        <MapSection />
      </main>
      <Footer />
    </div>
  );
};

export default Parties;
