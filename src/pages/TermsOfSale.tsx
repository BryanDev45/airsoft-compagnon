
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const TermsOfSale = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-airsoft-dark">Conditions Générales de Vente</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <p className="text-gray-700 italic">Dernière mise à jour : 15 juin 2025</p>

            <h2 className="text-2xl font-semibold mb-2">1. Objet et Champ d'Application</h2>
            <p className="text-gray-700">
              Les présentes Conditions Générales de Vente (CGV) ont pour objet de définir les conditions dans lesquelles les services payants pourraient être proposés sur la plateforme Airsoft Compagnon.
            </p>
            <p className="text-gray-700">
              <strong>À ce jour, l'utilisation de la plateforme Airsoft Compagnon est entièrement gratuite pour tous les utilisateurs (joueurs, équipes, organisateurs).</strong> Aucune fonctionnalité de paiement direct n'est intégrée au service. Ces CGV sont établies à titre préventif et s'appliqueront si des services payants venaient à être introduits.
            </p>
            
            <h2 className="text-2xl font-semibold mb-2">2. Transactions entre Organisateurs et Participants</h2>
            <p className="text-gray-700">
              Airsoft Compagnon est une plateforme de mise en relation. Certains organisateurs de parties peuvent demander une participation financière pour les événements qu'ils créent. 
            </p>
            <p className="text-gray-700">
              Toute transaction financière (paiement de frais d'inscription, achat de consommables, etc.) s'effectue <strong>directement entre le participant et l'organisateur</strong>, en dehors de la plateforme Airsoft Compagnon. Les modalités de paiement, d'annulation et de remboursement sont à la seule discrétion de l'organisateur de l'événement.
            </p>

            <h2 className="text-2xl font-semibold mb-2">3. Responsabilité d'Airsoft Compagnon</h2>
            <p className="text-gray-700">
              Airsoft Compagnon agit uniquement en tant qu'intermédiaire et ne participe à aucune transaction financière entre les utilisateurs. En conséquence, notre responsabilité ne saurait être engagée pour :
            </p>
            <ul className="list-disc list-inside text-gray-700 pl-4 space-y-2">
              <li>Les litiges relatifs au paiement des parties.</li>
              <li>Les demandes de remboursement en cas d'annulation ou d'insatisfaction.</li>
              <li>La gestion de la billetterie ou des inscriptions payantes des événements.</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Nous encourageons les utilisateurs à faire preuve de diligence et à vérifier les conditions spécifiques de chaque organisateur avant de s'engager financièrement.
            </p>
            
            <h2 className="text-2xl font-semibold mb-2">4. Évolution future des Services</h2>
            <p className="text-gray-700">
              Nous nous réservons le droit d'introduire à l'avenir des services payants sur Airsoft Compagnon (par exemple, des abonnements premium, la mise en avant d'événements, un service de billetterie intégré, etc.).
            </p>
            <p className="text-gray-700">
              Si de tels services étaient mis en place, les présentes CGV seraient mises à jour pour refléter précisément leur fonctionnement, et vous en seriez informé au préalable. Votre consentement explicite serait requis pour toute souscription à un service payant.
            </p>
            
            <h2 className="text-2xl font-semibold mb-2">5. Contact</h2>
            <p className="text-gray-700">
              Pour toute question relative à ces conditions ou au fonctionnement de la plateforme, vous pouvez nous contacter via notre <Link to="/contact" className="text-airsoft-red hover:underline">page de contact</Link>. Pour les questions relatives à la participation financière à un événement, veuillez contacter directement l'organisateur.
            </p>
            
            <h2 className="text-2xl font-semibold mb-2">6. Droit Applicable</h2>
            <p className="text-gray-700">
              Les présentes conditions sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfSale;
