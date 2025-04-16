
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CookiesPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-airsoft-dark">Politique de Cookies</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-4">1. Qu'est-ce qu'un cookie ?</h2>
            <p className="text-gray-700 mb-6">
              Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous visitez un site web ou utilisez une application. Les cookies nous permettent de reconnaître votre appareil et de mémoriser certaines informations sur votre visite, comme vos préférences ou vos informations de connexion.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">2. Types de cookies utilisés</h2>
            <p className="text-gray-700 mb-6">
              <strong>Cookies essentiels :</strong> Nécessaires au fonctionnement de l'application, ils permettent d'utiliser les fonctionnalités principales comme la gestion de votre session utilisateur.
            </p>
            <p className="text-gray-700 mb-6">
              <strong>Cookies de performance :</strong> Collectent des informations anonymes sur la façon dont vous utilisez notre application, afin d'améliorer sa performance et ses fonctionnalités.
            </p>
            <p className="text-gray-700 mb-6">
              <strong>Cookies de fonctionnalité :</strong> Permettent à l'application de mémoriser vos choix (comme votre nom d'utilisateur ou la région où vous vous trouvez) pour vous offrir une expérience plus personnalisée.
            </p>
            <p className="text-gray-700 mb-6">
              <strong>Cookies de ciblage :</strong> Enregistrent votre visite sur l'application, les pages que vous avez visitées et les liens que vous avez suivis. Ces informations peuvent être utilisées pour rendre notre application plus pertinente par rapport à vos intérêts.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">3. Gestion des cookies</h2>
            <p className="text-gray-700 mb-6">
              Vous pouvez contrôler et gérer les cookies de plusieurs façons. La plupart des navigateurs vous permettent de supprimer les cookies de votre appareil, de bloquer tous les cookies ou de recevoir un avertissement avant qu'un cookie ne soit stocké. Veuillez noter que la suppression ou le blocage des cookies peut affecter votre expérience utilisateur et certaines fonctionnalités de l'application pourraient ne pas fonctionner correctement.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">4. Cookies tiers</h2>
            <p className="text-gray-700 mb-6">
              Notre application peut également utiliser des services tiers qui peuvent placer des cookies sur votre appareil. Nous n'avons aucun contrôle sur ces cookies. Ces services incluent des outils d'analyse, des réseaux sociaux et des services de paiement.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">5. Durée de conservation des cookies</h2>
            <p className="text-gray-700 mb-6">
              La durée de vie d'un cookie varie en fonction de sa nature : les cookies de session expirent lorsque vous fermez votre navigateur, tandis que les cookies persistants peuvent rester stockés sur votre appareil pendant plusieurs mois ou jusqu'à ce que vous les supprimiez manuellement.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">6. Modifications de la politique de cookies</h2>
            <p className="text-gray-700">
              Nous nous réservons le droit de modifier cette politique de cookies à tout moment. Toute modification sera publiée sur cette page. Nous vous encourageons à consulter régulièrement cette page pour rester informé des mises à jour.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiesPolicy;
