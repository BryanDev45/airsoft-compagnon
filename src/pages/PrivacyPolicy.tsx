
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-airsoft-dark">Politique de Confidentialité</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-4">1. Collecte des données personnelles</h2>
            <p className="text-gray-700 mb-6">
              Airsoft Compagnon collecte les données personnelles suivantes : nom, prénom, adresse email, date de naissance, et, si fourni, numéro de téléphone et adresse postale. Ces informations sont nécessaires pour créer et gérer votre compte, vous permettre de participer aux événements et personnaliser votre expérience utilisateur.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">2. Utilisation des données</h2>
            <p className="text-gray-700 mb-6">
              Vos données personnelles sont utilisées pour :
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Créer et gérer votre compte utilisateur</li>
                <li>Vous permettre de vous inscrire aux événements</li>
                <li>Vous envoyer des confirmations de réservation et informations sur les événements auxquels vous participez</li>
                <li>Améliorer nos services et développer de nouvelles fonctionnalités</li>
                <li>Vous envoyer des communications marketing si vous y avez consenti</li>
              </ul>
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">3. Partage des données</h2>
            <p className="text-gray-700 mb-6">
              Vos données peuvent être partagées avec les organisateurs des événements auxquels vous vous inscrivez, dans le seul but de faciliter votre participation. Nous ne vendons pas vos données personnelles à des tiers. Nous pouvons également partager vos données avec nos sous-traitants (hébergement, paiement) qui agissent en notre nom et selon nos instructions.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">4. Conservation des données</h2>
            <p className="text-gray-700 mb-6">
              Vos données personnelles sont conservées aussi longtemps que nécessaire pour fournir nos services ou pour respecter nos obligations légales. Si vous supprimez votre compte, vos données personnelles seront supprimées ou anonymisées, sauf si nous sommes légalement tenus de les conserver.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">5. Vos droits</h2>
            <p className="text-gray-700 mb-6">
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants concernant vos données personnelles :
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Droit d'accès</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité des données</li>
                <li>Droit d'opposition</li>
              </ul>
              Pour exercer ces droits, veuillez nous contacter à l'adresse privacy@airsoftcompagnon.fr.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">6. Sécurité des données</h2>
            <p className="text-gray-700 mb-6">
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données personnelles contre tout accès non autorisé, modification, divulgation ou destruction.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">7. Modifications de la politique de confidentialité</h2>
            <p className="text-gray-700">
              Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Toute modification sera publiée sur cette page et, si les changements sont significatifs, nous vous en informerons par email ou via une notification dans l'application.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
