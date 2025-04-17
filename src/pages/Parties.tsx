
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import MapSection from '../components/MapSection';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Parties = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const authState = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authState === 'true');
  }, []);

  const handleCreateParty = () => {
    if (isAuthenticated) {
      navigate('/parties/create');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Recherche de parties</h1>
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
