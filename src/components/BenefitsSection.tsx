
import React from 'react';
import { Card } from "@/components/ui/card";
import { MapPin, Users, Search, Check } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <MapPin className="h-8 w-8 text-airsoft-red mb-4" />,
      title: "Trouvez les meilleurs terrains",
      description: "Accédez à une carte interactive des terrains d'airsoft près de chez vous, avec des avis et des informations détaillées sur chaque site."
    },
    {
      icon: <Users className="h-8 w-8 text-airsoft-red mb-4" />,
      title: "Rejoignez une équipe",
      description: "Trouvez et rejoignez une équipe qui correspond à votre style de jeu et à vos objectifs, ou créez la vôtre et recrutez des joueurs."
    },
    {
      icon: <Search className="h-8 w-8 text-airsoft-red mb-4" />,
      title: "Découvrez les événements",
      description: "Ne manquez aucun événement d'airsoft grâce à notre calendrier complet et nos notifications personnalisées."
    },
    {
      icon: <Check className="h-8 w-8 text-airsoft-red mb-4" />,
      title: "Gérez vos parties",
      description: "Organisez et gérez facilement vos parties d'airsoft, avec un système complet de réservation et de paiement en ligne."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Pourquoi choisir Airsoft Compagnon ?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez tous les avantages de notre plateforme conçue spécifiquement pour la communauté airsoft
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="text-center">
                {benefit.icon}
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
