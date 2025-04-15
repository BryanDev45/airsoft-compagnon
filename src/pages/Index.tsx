
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import MapSection from '../components/MapSection';
import BenefitsSection from '../components/BenefitsSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <div className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Airsoft compagnon, c'est quoi ?</h2>
            <p className="text-lg text-gray-700 mb-4">
              Que vous soyez organisateur ou simplement joueur, Airsoft Compagnon est l'outil indispensable pour votre passion.
              Trouvez facilement vos parties d'airsoft en un seul clic, ou même les magasins autour de vous.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Publiez vos parties en toute simplicité, sans vous inquiéter des paiements et des inscriptions. Nous nous occupons de tout pour vous.
            </p>
            <p className="text-lg font-bold text-airsoft-red">
              Le plus ? Tout ça est totalement gratuit !
            </p>
          </div>
        </div>
        <MapSection />
        <BenefitsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
