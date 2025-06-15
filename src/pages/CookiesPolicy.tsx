
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const CookiesPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-airsoft-dark">Politique de Cookies</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <p className="text-gray-700">
              Dernière mise à jour : 15 juin 2025
            </p>

            <p className="text-gray-700">
              Bienvenue sur Airsoft Compagnon. Cette politique explique comment nous utilisons les cookies et technologies similaires pour vous reconnaître lorsque vous visitez notre site web. Elle explique ce que sont ces technologies et pourquoi nous les utilisons, ainsi que vos droits de contrôler notre utilisation de celles-ci.
            </p>

            <div>
              <h2 className="text-2xl font-semibold mb-4">1. Qu'est-ce qu'un cookie ?</h2>
              <p className="text-gray-700">
                Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, tablette, mobile) lorsque vous visitez un site web. Les cookies nous permettent de faire fonctionner notre site plus efficacement, de mémoriser vos préférences et de vous fournir une expérience de navigation plus fluide et personnalisée.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">2. Comment nous utilisons les cookies</h2>
              <p className="text-gray-700 mb-4">
                Nous utilisons des cookies internes pour plusieurs raisons détaillées ci-dessous. Il est important de noter que notre site n'utilise pas de cookies de performance tiers (comme Google Analytics) ni de cookies de ciblage publicitaire pour le moment.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Cookies Essentiels (Strictement Nécessaires)</h3>
                  <p className="text-gray-700">
                    Ces cookies sont indispensables au bon fonctionnement du site. Ils vous permettent de naviguer sur le site et d'utiliser ses fonctionnalités, comme l'accès à des zones sécurisées (votre profil, par exemple). Sans ces cookies, les services que vous avez demandés ne peuvent pas être fournis.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mt-2 pl-4">
                    <li><strong>Gestion de session :</strong> Pour vous maintenir connecté à votre compte.</li>
                    <li><strong>Sécurité :</strong> Pour protéger votre compte et nos services.</li>
                    <li><strong>Consentement aux cookies :</strong> Pour mémoriser votre choix concernant l'utilisation des cookies.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Cookies de Fonctionnalité</h3>
                  <p className="text-gray-700">
                    Ces cookies permettent au site de se souvenir des choix que vous faites (comme l'option "Se souvenir de moi" lors de la connexion) afin de vous offrir une expérience plus personnelle et pratique.
                  </p>
                   <ul className="list-disc list-inside text-gray-700 mt-2 pl-4">
                    <li><strong>Préférences de connexion :</strong> Si vous choisissez "Se souvenir de moi", un cookie persistant est utilisé pour vous garder connecté plus longtemps.</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">3. Cookies Tiers</h2>
              <p className="text-gray-700">
                Nous utilisons les services de Supabase pour l'authentification des utilisateurs. Supabase peut déposer ses propres cookies pour assurer le bon fonctionnement et la sécurité du processus d'authentification. Nous ne contrôlons pas ces cookies. Pour en savoir plus, nous vous invitons à consulter la politique de confidentialité de Supabase.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">4. Gestion de vos préférences de cookies</h2>
              <p className="text-gray-700 mb-4">
                Lors de votre première visite sur notre site, un bandeau de consentement aux cookies apparaît. Vous pouvez accepter ou refuser l'utilisation des cookies non essentiels.
              </p>
              <p className="text-gray-700">
                Vous pouvez également configurer votre navigateur pour refuser certains ou tous les cookies. Cependant, si vous bloquez les cookies essentiels via votre navigateur, certaines parties de notre site pourraient ne pas fonctionner correctement.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">5. Durée de conservation des cookies</h2>
              <p className="text-gray-700">
                La durée de vie d'un cookie varie : les "cookies de session" sont supprimés lorsque vous fermez votre navigateur. Les "cookies persistants" restent sur votre appareil pour une durée déterminée (par exemple, pour l'option "Se souvenir de moi" ou pour votre consentement) ou jusqu'à ce que vous les supprimiez manuellement.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">6. Modifications de cette politique</h2>
              <p className="text-gray-700">
                Nous pouvons mettre à jour cette politique de cookies de temps à autre pour refléter, par exemple, des changements dans les cookies que nous utilisons ou pour d'autres raisons opérationnelles, légales ou réglementaires. Nous vous encourageons à consulter régulièrement cette page pour rester informé.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">7. Nous contacter</h2>
              <p className="text-gray-700">
                Si vous avez des questions sur notre utilisation des cookies, veuillez nous contacter via notre <Link to="/contact" className="text-airsoft-red hover:underline">page de contact</Link>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiesPolicy;
