
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8 text-center">À propos d'Airsoft Compagnon</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-lg mb-6">
              Airsoft Compagnon est la plateforme idéale pour tous les passionnés d'airsoft en France. 
              Notre mission est de connecter les joueurs et de faciliter l'organisation de parties.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">Notre histoire</h2>
            <p className="mb-6">
              Lancé en 2023, Airsoft Compagnon est né de la passion de joueurs d'airsoft qui cherchaient
              à simplifier l'organisation et la recherche de parties. Notre plateforme a depuis évolué pour
              devenir un outil complet au service de la communauté airsoft française.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">Nos valeurs</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Esprit sportif et respect des règles de sécurité</li>
              <li>Inclusion et accueil des nouveaux joueurs</li>
              <li>Promotion de l'airsoft comme activité de loisir responsable</li>
              <li>Transparence et honnêteté dans toutes nos communications</li>
            </ul>
            
            <h2 className="text-xl font-semibold mb-4">Notre équipe</h2>
            <p className="mb-6">
              Notre équipe est composée de passionnés d'airsoft qui travaillent constamment à améliorer
              la plateforme et à offrir la meilleure expérience possible aux utilisateurs.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
