
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsOfSale = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-airsoft-dark">Conditions Générales de Vente</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-4">1. Objet</h2>
            <p className="text-gray-700 mb-6">
              Les présentes Conditions Générales de Vente régissent les relations contractuelles entre Airsoft Compagnon et les utilisateurs de la plateforme concernant l'achat de tickets pour des parties d'airsoft ou tout autre service payant proposé sur l'application.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">2. Prix et paiement</h2>
            <p className="text-gray-700 mb-6">
              Les prix des tickets et services sont indiqués en euros, toutes taxes comprises. Le paiement s'effectue via les moyens de paiement sécurisés proposés sur l'application. Airsoft Compagnon se réserve le droit de modifier ses prix à tout moment, mais les produits seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">3. Confirmation de commande</h2>
            <p className="text-gray-700 mb-6">
              Après validation du paiement, l'utilisateur recevra une confirmation de commande par email comprenant un récapitulatif de sa commande et un ticket numérique ou un code QR à présenter lors de l'événement.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">4. Droit de rétractation et politique d'annulation</h2>
            <p className="text-gray-700 mb-6">
              Conformément à l'article L.221-28 12° du Code de la consommation, le droit de rétractation ne peut être exercé pour les services de loisirs fournis à une date déterminée. Toutefois, certains organisateurs peuvent proposer des conditions d'annulation spécifiques, qui seront clairement indiquées lors de l'achat du ticket.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">5. Responsabilité</h2>
            <p className="text-gray-700 mb-6">
              Airsoft Compagnon agit en tant qu'intermédiaire entre les organisateurs d'événements et les participants. La responsabilité d'Airsoft Compagnon se limite à la bonne exécution du service de billetterie. Tout litige relatif au déroulement de l'événement doit être adressé directement à l'organisateur.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">6. Force majeure</h2>
            <p className="text-gray-700 mb-6">
              Airsoft Compagnon ne pourra être tenu responsable de l'inexécution de ses obligations en cas de force majeure, telle que définie par la jurisprudence française. Dans le cas où un événement serait annulé pour cause de force majeure, les modalités de remboursement seront définies par l'organisateur de l'événement.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">7. Service client</h2>
            <p className="text-gray-700 mb-6">
              Pour toute question ou réclamation concernant une commande, les utilisateurs peuvent contacter le service client d'Airsoft Compagnon via le formulaire de contact disponible sur l'application ou par email à l'adresse support@airsoftcompagnon.fr.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">8. Droit applicable et juridiction compétente</h2>
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
