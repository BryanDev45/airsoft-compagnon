
import React from 'react';
import Header from '../components/Header';
import MapSection from '../components/MapSection';
import Footer from '../components/Footer';

const Parties = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">Parties d'airsoft</h1>
            <p className="text-gray-600">
              Trouvez et rejoignez des parties d'airsoft près de chez vous
            </p>
          </div>
        </div>
        <MapSection />
      </main>
      <Footer />
    </div>
  );
};

export default Parties;
