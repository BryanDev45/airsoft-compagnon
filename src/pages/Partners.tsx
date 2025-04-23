
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Partner = {
  id: number;
  name: string;
  logo: string;
  description: string;
  website: string;
  category: string;
};

const partners: Partner[] = [
  {
    id: 1,
    name: "AirsoftGear Pro",
    logo: "/lovable-uploads/8c35b648-4640-4896-943d-3e329c86a080.png",
    description: "Fournisseur d'équipements d'airsoft haut de gamme pour les joueurs exigeants.",
    website: "https://example.com/airsoftgear",
    category: "Équipement"
  },
  {
    id: 2,
    name: "Tactical Zone",
    logo: "/lovable-uploads/c242d3b0-8906-4f00-9b3b-fc251f703e4b.png",
    description: "Terrain d'airsoft avec des scénarios variés et des infrastructures professionnelles.",
    website: "https://example.com/tacticalzone",
    category: "Terrain"
  },
  {
    id: 3,
    name: "AirsoftTech",
    logo: "/lovable-uploads/dabf8bbc-44a7-4c03-bebe-009592f0c6c8.png",
    description: "Réparation, maintenance et upgrade de répliques d'airsoft par des techniciens certifiés.",
    website: "https://example.com/airsofttech",
    category: "Service"
  },
  {
    id: 4,
    name: "MilSim Events",
    logo: "/lovable-uploads/91892f89-5113-4653-aec1-727924a97b17.png",
    description: "Organisation d'événements milsim de grande envergure dans toute l'Europe.",
    website: "https://example.com/milsimevents",
    category: "Événement"
  },
  {
    id: 5,
    name: "Airsoft Magazine",
    logo: "/lovable-uploads/364d4f7f-8b4d-4ff8-bdd4-3257db537d1e.png",
    description: "Magazine mensuel dédié à l'airsoft avec des tests de matériel et des reportages.",
    website: "https://example.com/airsoftmag",
    category: "Média"
  }
];

const Partners = () => {
  const categories = [...new Set(partners.map(partner => partner.category))];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Nos Partenaires</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les partenaires qui nous font confiance et contribuent à faire grandir la communauté Airsoft Compagnon.
            </p>
          </div>

          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partners.map((partner) => (
                <Card key={partner.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2 flex justify-center items-center h-40 bg-gray-100">
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="max-h-32 max-w-[80%] object-contain"
                    />
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="mb-2 flex justify-between items-center">
                      <CardTitle className="text-xl">{partner.name}</CardTitle>
                      <span className="bg-airsoft-red text-xs text-white px-2 py-1 rounded-full">{partner.category}</span>
                    </div>
                    <CardDescription className="min-h-[60px]">{partner.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={partner.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                        Visiter le site <ExternalLink size={16} className="ml-2" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Vous souhaitez devenir partenaire ?</h2>
            <p className="text-center mb-8">
              Rejoignez notre réseau de partenaires et bénéficiez d'une visibilité auprès de notre communauté passionnée d'airsoft.
            </p>
            <div className="flex justify-center">
              <Button className="bg-airsoft-red hover:bg-red-700" asChild>
                <a href="/contact">Nous contacter</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Partners;
