
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageSquare } from 'lucide-react';

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full mb-4">
              <MessageSquare className="h-8 w-8 text-airsoft-red" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Foire Aux Questions</h1>
            <p className="text-lg text-gray-600">
              Trouvez des réponses aux questions les plus fréquemment posées
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-medium">
                Qu'est-ce que l'airsoft ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                L'airsoft est un loisir sportif opposant plusieurs joueurs équipés de répliques d'armes projetant des billes biodégradables. 
                L'objectif du jeu est d'éliminer les adversaires en les touchant avec ces billes. L'airsoft est basé sur un système de fair-play, 
                chaque joueur reconnaissant de lui-même quand il est touché.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-medium">
                Comment fonctionne Airsoft Compagnon ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Airsoft Compagnon est une plateforme qui permet aux joueurs de trouver facilement des parties d'airsoft et 
                des équipements près de chez eux. Les organisateurs peuvent également créer et gérer leurs événements sur la plateforme. 
                L'inscription est gratuite et vous donne accès à toutes les fonctionnalités de base.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-medium">
                Est-ce que Airsoft Compagnon est gratuit ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Oui ! Airsoft Compagnon est entièrement gratuit pour les utilisateurs cherchant des parties et pour 
                les organisateurs créant des événements de base. Nous proposons également des fonctionnalités premium 
                pour les organisateurs souhaitant des options avancées.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-medium">
                Comment puis-je créer une partie sur Airsoft Compagnon ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Pour créer une partie, vous devez d'abord vous inscrire sur la plateforme. Ensuite, 
                accédez à votre tableau de bord et cliquez sur "Créer une partie". Remplissez les informations 
                requises comme la date, le lieu, le type de jeu, les règles et les frais d'inscription si applicables. 
                Une fois validé, votre événement sera visible par tous les utilisateurs de la plateforme.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-medium">
                Comment puis-je m'inscrire à une partie ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Pour vous inscrire à une partie, naviguez dans la liste des événements disponibles et 
                cliquez sur celui qui vous intéresse. Sur la page de détails de l'événement, vous trouverez 
                un bouton "S'inscrire". Selon les paramètres définis par l'organisateur, vous pourrez soit 
                vous inscrire directement, soit être placé sur une liste d'attente pour approbation.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg font-medium">
                Quel équipement est nécessaire pour l'airsoft ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                L'équipement minimum pour l'airsoft comprend une protection oculaire certifiée (lunettes ou masque), 
                une réplique d'airsoft et des billes biodégradables. Pour plus de confort et de protection, il est 
                recommandé d'avoir également un masque facial complet, des vêtements adaptés, des gants et éventuellement 
                une protection pour les genoux et les coudes. Chaque terrain peut avoir des exigences spécifiques en 
                matière d'équipement de sécurité.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7">
              <AccordionTrigger className="text-lg font-medium">
                Comment puis-je contacter le support ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Vous pouvez contacter notre équipe de support via la page "Contact" de notre site, 
                par email à support@airsoftcompagnon.fr ou via nos réseaux sociaux. Nous nous efforçons 
                de répondre à toutes les demandes dans un délai de 24-48 heures ouvrables.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8">
              <AccordionTrigger className="text-lg font-medium">
                Comment fonctionne l'application PWA ?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Notre Progressive Web App (PWA) vous permet d'installer Airsoft Compagnon sur votre 
                appareil mobile ou votre ordinateur pour y accéder rapidement, même avec une connexion 
                internet limitée. Pour l'installer, naviguez sur notre site web avec votre navigateur, 
                puis utilisez l'option "Ajouter à l'écran d'accueil" (sur mobile) ou "Installer" (sur ordinateur) 
                généralement disponible dans le menu du navigateur.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="mt-12 p-6 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Vous n'avez pas trouvé votre réponse ?</h2>
            <p className="mb-4">N'hésitez pas à nous contacter directement pour toute question supplémentaire.</p>
            <div className="flex flex-wrap gap-4">
              <a href="/contact" className="text-airsoft-red hover:underline font-medium">
                Nous contacter →
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
