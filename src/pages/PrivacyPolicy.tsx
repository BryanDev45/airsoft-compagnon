
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-airsoft-dark">Politique de Confidentialité</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <p className="text-gray-700">
              Dernière mise à jour : 15 juin 2025
            </p>

            <p className="text-gray-700">
              Bienvenue sur Airsoft Compagnon. Votre vie privée est importante pour nous. Cette politique de confidentialité vise à vous informer sur la manière dont nous collectons, utilisons, partageons et protégeons vos données personnelles lorsque vous utilisez notre site web et nos services.
            </p>

            <div>
              <h2 className="text-2xl font-semibold mb-4">1. Les données que nous collectons</h2>
              <p className="text-gray-700 mb-4">
                Nous collectons différentes catégories de données pour vous fournir et améliorer nos services :
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Données que vous nous fournissez directement</h3>
                  <ul className="list-disc list-inside text-gray-700 mt-2 pl-4 space-y-1">
                    <li><strong>Informations de compte :</strong> Lors de votre inscription, nous collectons votre nom, prénom, adresse e-mail et date de naissance.</li>
                    <li><strong>Informations de profil :</strong> Vous pouvez choisir d'ajouter des informations à votre profil public, telles qu'un pseudonyme, une biographie, une photo de profil, une bannière, votre équipement d'airsoft et votre localisation (ville/département).</li>
                    <li><strong>Vérification d'identité :</strong> Si vous choisissez de faire vérifier votre compte, nous collectons une copie de votre pièce d'identité. Ces documents sont utilisés uniquement pour la vérification et sont supprimés après traitement.</li>
                    <li><strong>Communications :</strong> Le contenu de vos messages envoyés à d'autres utilisateurs via notre messagerie, ainsi que les signalements que vous soumettez.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Données que nous collectons automatiquement</h3>
                  <p className="text-gray-700">
                    Lorsque vous utilisez notre site, nous collectons automatiquement certaines informations techniques, telles que votre adresse IP et les informations sur votre navigateur, principalement pour des raisons de sécurité et de fonctionnement. Ces données sont gérées par notre prestataire Supabase.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Données générées par votre activité</h3>
                   <ul className="list-disc list-inside text-gray-700 mt-2 pl-4 space-y-1">
                    <li><strong>Données de modération :</strong> Les avertissements que vous pouvez recevoir de la part de notre équipe de modération.</li>
                    <li><strong>Données de réputation :</strong> Les notes et évaluations que vous donnez ou recevez de la part d'autres utilisateurs.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">2. Comment nous utilisons vos données</h2>
              <p className="text-gray-700 mb-4">
                Vos données personnelles sont utilisées pour les finalités suivantes :
              </p>
              <ul className="list-disc list-inside text-gray-700 pl-4 space-y-2">
                <li><strong>Fournir et gérer nos services :</strong> Créer votre compte, afficher votre profil, vous permettre d'utiliser la messagerie et de vous inscrire à des parties.</li>
                <li><strong>Assurer la sécurité de la plateforme :</strong> Modérer les contenus, traiter les signalements, gérer les avertissements et vérifier l'identité des utilisateurs pour prévenir la fraude.</li>
                <li><strong>Améliorer et personnaliser votre expérience :</strong> Adapter le contenu, développer de nouvelles fonctionnalités et comprendre comment vous utilisez le service.</li>
                <li><strong>Communiquer avec vous :</strong> Vous envoyer des notifications importantes (ex: confirmations d'inscription, notifications de messages), et répondre à vos demandes via notre support. Nous ne vous enverrons pas d'e-mails marketing sans votre consentement explicite.</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">3. Avec qui nous partageons vos données</h2>
               <p className="text-gray-700 mb-4">
                Nous ne vendons jamais vos données personnelles. Nous ne les partageons qu'avec les tiers suivants :
              </p>
              <ul className="list-disc list-inside text-gray-700 pl-4 space-y-2">
                <li><strong>Les autres utilisateurs du site :</strong> Les informations de votre profil que vous rendez publiques (pseudonyme, avatar, biographie, etc.) sont visibles par les autres utilisateurs.</li>
                <li><strong>Les organisateurs de parties :</strong> Lorsque vous vous inscrivez à une partie, nous partageons les informations nécessaires (généralement votre pseudonyme) avec l'organisateur pour la gestion de l'événement.</li>
                <li><strong>Nos fournisseurs de services :</strong> Nous utilisons les services de <strong>Supabase</strong> pour l'hébergement de notre infrastructure, l'authentification, la base de données et le stockage de fichiers. Supabase est contractuellement tenu de protéger vos données.</li>
                <li><strong>Les autorités légales :</strong> Si nous y sommes contraints par la loi ou dans le cadre d'une procédure judiciaire.</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">4. Durée de conservation des données</h2>
              <p className="text-gray-700">
                Nous conservons vos données personnelles aussi longtemps que votre compte est actif. Si vous supprimez votre compte, la plupart de vos données seront supprimées de manière définitive. Certaines données peuvent être conservées sous forme anonymisée à des fins statistiques, ou si nous avons une obligation légale de les conserver plus longtemps. Les documents de vérification d'identité sont supprimés dès que la procédure de vérification est terminée.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">5. Vos droits sur vos données</h2>
              <p className="text-gray-700 mb-4">
                Conformément au RGPD, vous disposez de plusieurs droits sur vos données personnelles :
              </p>
              <ul className="list-disc list-inside text-gray-700 pl-4 space-y-1">
                <li>Droit d'accès et de rectification (vous pouvez modifier la plupart de vos informations directement depuis votre profil).</li>
                <li>Droit à l'effacement ("droit à l'oubli").</li>
                <li>Droit à la limitation du traitement.</li>
                <li>Droit à la portabilité des données.</li>
                <li>Droit d'opposition au traitement.</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Pour exercer ces droits, veuillez nous contacter via notre <Link to="/contact" className="text-airsoft-red hover:underline">page de contact</Link>.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">6. Sécurité des données</h2>
              <p className="text-gray-700">
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données personnelles contre la perte, l'utilisation abusive, l'accès non autorisé, la divulgation ou l'altération.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
              <p className="text-gray-700">
                Nous utilisons des cookies pour le bon fonctionnement de notre site. Pour en savoir plus, consultez notre <Link to="/cookies-policy" className="text-airsoft-red hover:underline">Politique de Cookies</Link>.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">8. Modifications de cette politique</h2>
              <p className="text-gray-700">
                Nous pouvons être amenés à modifier cette politique de confidentialité. En cas de changement majeur, nous vous en informerons par e-mail ou via une notification sur le site. Nous vous encourageons à consulter cette page régulièrement.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
