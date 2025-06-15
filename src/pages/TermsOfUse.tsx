
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const TermsOfUse = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-airsoft-dark">Conditions Générales d'Utilisation</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
            <p className="text-gray-700 italic">Dernière mise à jour : 15 juin 2025</p>
            
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-2">1. Préambule et Acceptation</h2>
                <p className="text-gray-700">
                Bienvenue sur Airsoft Compagnon ! En accédant à notre site web et en utilisant nos services, vous acceptez d'être lié par les présentes Conditions Générales d'Utilisation (ci-après "CGU"). Celles-ci régissent votre accès et votre utilisation de la plateforme. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser nos services.
                </p>
            </div>
            
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-2">2. Description du Service</h2>
                <p className="text-gray-700">
                Airsoft Compagnon est une plateforme communautaire conçue pour les passionnés d'airsoft. Nos services incluent, sans s'y limiter :
                </p>
                <ul className="list-disc list-inside text-gray-700 pl-4 space-y-2">
                    <li>La création et la gestion de profils d'utilisateurs détaillés (équipement, statistiques, réputation).</li>
                    <li>La recherche et l'inscription à des parties d'airsoft organisées par la communauté.</li>
                    <li>La création et la gestion d'événements (parties) pour les organisateurs.</li>
                    <li>La création, la gestion et l'adhésion à des équipes.</li>
                    <li>Un système de messagerie privée pour communiquer avec d'autres utilisateurs et équipes.</li>
                    <li>Une carte interactive recensant terrains, magasins et événements.</li>
                    <li>Un système de notation et de réputation entre utilisateurs.</li>
                    <li>Des outils pratiques pour les joueurs (calculateurs, glossaire, etc.).</li>
                </ul>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-2">3. Inscription et Compte Utilisateur</h2>
                <p className="text-gray-700">
                L'accès à la plupart des fonctionnalités nécessite la création d'un compte. En vous inscrivant, vous vous engagez à :
                </p>
                <ul className="list-disc list-inside text-gray-700 pl-4 space-y-2">
                    <li>Fournir des informations exactes, complètes et à jour, notamment votre date de naissance. L'utilisation de la plateforme est soumise aux lois en vigueur concernant la pratique de l'airsoft, notamment les restrictions d'âge.</li>
                    <li>Maintenir la confidentialité de votre mot de passe et de votre compte. Vous êtes seul responsable de toutes les activités qui se déroulent sous votre compte.</li>
                    <li>Nous proposons une procédure de vérification d'identité facultative pour renforcer la confiance au sein de la communauté. Les conditions spécifiques à cette vérification sont détaillées dans notre <Link to="/privacy-policy" className="text-airsoft-red hover:underline">Politique de Confidentialité</Link>.</li>
                </ul>
            </div>
            
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-2">4. Contenu Utilisateur</h2>
                 <p className="text-gray-700">
                Vous êtes responsable de tout contenu (textes, images, informations de profil, messages) que vous publiez sur Airsoft Compagnon ("Contenu Utilisateur"). En publiant ce contenu, vous nous accordez une licence mondiale, non exclusive, et gratuite pour utiliser, reproduire, et afficher ce contenu dans le cadre de la fourniture de nos services.
                </p>
                <p className="text-gray-700">
                Vous garantissez que votre Contenu Utilisateur ne viole aucun droit de tiers (droit d'auteur, marque, vie privée, etc.) et n'est pas illégal, trompeur ou malveillant.
                </p>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-2">5. Règles de Conduite et Modération</h2>
                <p className="text-gray-700">
                Pour garantir une expérience positive et sécurisée, tous les utilisateurs doivent respecter les règles suivantes :
                </p>
                <ul className="list-disc list-inside text-gray-700 pl-4 space-y-2">
                    <li><strong>Respect et courtoisie :</strong> Le harcèlement, les insultes, la discrimination et toute forme de discours haineux sont strictement interdits.</li>
                    <li><strong>Contenu inapproprié :</strong> Ne publiez aucun contenu illégal, violent, pornographique, diffamatoire ou portant atteinte à la dignité humaine.</li>
                    <li><strong>Honnêteté :</strong> Ne vous faites pas passer pour quelqu'un d'autre, ne créez pas de faux profils et ne publiez pas d'informations trompeuses (par exemple, sur des événements).</li>
                    <li><strong>Sécurité :</strong> Ne partagez pas d'informations personnelles sensibles et respectez la vie privée des autres utilisateurs.</li>
                </ul>
                 <p className="text-gray-700 mt-4">
                Nous avons mis en place un système de signalement pour nous aider à maintenir une communauté saine. Tout utilisateur peut signaler un contenu ou un comportement qui enfreint ces règles. Notre équipe de modération examinera les signalements et pourra prendre des sanctions appropriées, incluant :
                </p>
                 <ul className="list-disc list-inside text-gray-700 pl-4 space-y-2">
                    <li>L'émission d'un avertissement.</li>
                    <li>La suppression du contenu litigieux.</li>
                    <li>La suspension temporaire ou la résiliation définitive de votre compte.</li>
                </ul>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-2">6. Rôles et Responsabilités</h2>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Organisateurs de parties</h3>
                <p className="text-gray-700">
                Les organisateurs sont responsables de la bonne tenue des événements qu'ils publient : exactitude des informations, respect des règles de sécurité locales, assurances nécessaires, etc. Airsoft Compagnon n'est qu'une plateforme de mise en relation et ne peut être tenu responsable du déroulement des parties.
                </p>
                <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">Chefs d'équipe</h3>
                <p className="text-gray-700">
                Les chefs d'équipe sont responsables de la gestion des membres de leur équipe, y compris le recrutement et l'exclusion, ainsi que de l'image de leur équipe sur la plateforme.
                </p>
            </div>
            
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-2">7. Propriété Intellectuelle</h2>
                <p className="text-gray-700">
                À l'exception du Contenu Utilisateur, tous les éléments du site (textes, graphiques, logos, code) sont la propriété exclusive d'Airsoft Compagnon et sont protégés par les lois sur la propriété intellectuelle.
                </p>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-2">8. Limitation de Responsabilité</h2>
                <p className="text-gray-700">
                L'airsoft est une activité qui comporte des risques. Airsoft Compagnon agit en tant qu'intermédiaire et ne pourra en aucun cas être tenu pour responsable des incidents (blessures, vols, litiges) survenant avant, pendant ou après les parties ou lors d'échanges entre utilisateurs. Chaque participant s'engage à être couvert par une assurance responsabilité civile et à respecter les consignes de sécurité.
                </p>
            </div>
            
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-2">9. Modifications des CGU</h2>
                <p className="text-gray-700">
                Nous nous réservons le droit de modifier ces CGU à tout moment. En cas de modification substantielle, vous en serez notifié. Votre utilisation continue du service après une modification vaut acceptation des nouvelles conditions.
                </p>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-2">10. Droit Applicable et Juridiction</h2>
                <p className="text-gray-700">
                Les présentes CGU sont régies par le droit français. Tout litige relatif à leur interprétation ou exécution sera de la compétence exclusive des tribunaux français.
                </p>
            </div>
             <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-2">11. Contact</h2>
                <p className="text-gray-700">
                Pour toute question concernant ces CGU, veuillez nous contacter via notre <Link to="/contact" className="text-airsoft-red hover:underline">page de contact</Link>.
                </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfUse;
