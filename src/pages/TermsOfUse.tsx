
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsOfUse = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-airsoft-dark">Conditions Générales d'Utilisation</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptation des conditions</h2>
            <p className="text-gray-700 mb-6">
              En accédant et en utilisant l'application Airsoft Compagnon, vous acceptez d'être lié par les présentes Conditions Générales d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser l'application.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">2. Description du service</h2>
            <p className="text-gray-700 mb-6">
              Airsoft Compagnon est une plateforme permettant aux joueurs d'airsoft de trouver des parties, de s'y inscrire, et aux organisateurs de créer et gérer leurs événements. L'application propose également une carte interactive des terrains et magasins d'airsoft.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">3. Inscription et compte utilisateur</h2>
            <p className="text-gray-700 mb-6">
              Pour utiliser certaines fonctionnalités de l'application, vous devez créer un compte utilisateur. Vous êtes responsable de maintenir la confidentialité de vos informations de connexion et de toutes les activités qui se produisent sous votre compte.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">4. Règles de conduite</h2>
            <p className="text-gray-700 mb-6">
              Les utilisateurs s'engagent à ne pas publier de contenu illégal, diffamatoire, obscène ou autrement inapproprié. Airsoft Compagnon se réserve le droit de supprimer tout contenu et de suspendre ou résilier les comptes des utilisateurs qui enfreignent ces règles.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">5. Propriété intellectuelle</h2>
            <p className="text-gray-700 mb-6">
              Tout le contenu présent sur l'application, incluant mais non limité aux textes, graphiques, logos, icônes, images, clips audio, téléchargements numériques et compilations de données, est la propriété d'Airsoft Compagnon ou de ses fournisseurs de contenu et est protégé par les lois françaises et internationales sur la propriété intellectuelle.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">6. Limitation de responsabilité</h2>
            <p className="text-gray-700 mb-6">
              Airsoft Compagnon n'est pas responsable des blessures, dommages ou pertes subis lors de la pratique de l'airsoft. Les utilisateurs participent aux événements à leurs propres risques et sont tenus de respecter toutes les règles de sécurité applicables.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">7. Modifications des conditions</h2>
            <p className="text-gray-700 mb-6">
              Airsoft Compagnon se réserve le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés des changements substantiels et leur utilisation continue de l'application après ces modifications constitue leur acceptation des nouvelles conditions.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">8. Loi applicable</h2>
            <p className="text-gray-700">
              Les présentes conditions sont régies par la loi française. Tout litige relatif à l'interprétation ou à l'exécution de ces conditions sera soumis à la compétence exclusive des tribunaux français.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfUse;
