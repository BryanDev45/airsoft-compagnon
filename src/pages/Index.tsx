import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import MapSection from '../components/MapSection';
import BenefitsSection from '../components/BenefitsSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import { TargetIcon, UsersIcon, CreditCardIcon } from 'lucide-react';
const Index = () => {
  return <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <div className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-[20px] relative">
          
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
                <span className="relative z-10">Airsoft companion, c'est quoi ?</span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-airsoft-red/20 -z-0"></span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                La plateforme qui simplifie votre expérience airsoft de A à Z
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-airsoft-red">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-airsoft-red/10 rounded-full">
                    <TargetIcon size={36} className="text-airsoft-red" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Pour les joueurs</h3>
                <p className="text-gray-600 text-center">
                  Trouvez facilement vos parties d'airsoft et les magasins autour de vous en un seul clic.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-airsoft-red">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-airsoft-red/10 rounded-full">
                    <UsersIcon size={36} className="text-airsoft-red" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Pour les organisateurs</h3>
                <p className="text-gray-600 text-center">
                  Publiez vos parties et gérez vos inscriptions en toute simplicité, sans vous soucier de l'administration.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-airsoft-red">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-airsoft-red/10 rounded-full">
                    <CreditCardIcon size={36} className="text-airsoft-red" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">100% Gratuit</h3>
                <p className="text-gray-600 text-center">Tous nos services sont entièrement gratuits pour la communauté airsoft.</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-lg font-bold text-airsoft-red inline-block px-6 py-3 bg-airsoft-red/10 rounded-full">
                Le plus ? Tout ça est totalement gratuit !
              </p>
            </div>
          </div>
        </div>
        <MapSection />
        <BenefitsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>;
};
export default Index;