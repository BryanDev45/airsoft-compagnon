
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, Search } from 'lucide-react';

const glossaryItems = [
  {
    term: "AEG",
    definition: "Airsoft Electric Gun - Réplique airsoft électrique équipée d'un moteur et d'une batterie.",
    category: "Équipement"
  },
  {
    term: "FPS",
    definition: "Feet Per Second - Unité de mesure de la vitesse de sortie des billes (1 FPS = 0.3048 m/s).",
    category: "Mesure"
  },
  {
    term: "Hop-up",
    definition: "Système appliquant un effet rétro-rotatif à la bille pour augmenter sa portée.",
    category: "Technique"
  },
  {
    term: "GBB",
    definition: "Gas Blow Back - Réplique à gaz avec système de recul simulant le fonctionnement d'une vraie arme.",
    category: "Équipement"
  },
  {
    term: "DMR",
    definition: "Designated Marksman Rifle - Réplique de précision semi-automatique à puissance intermédiaire.",
    category: "Équipement"
  },
  {
    term: "ROF",
    definition: "Rate Of Fire - Cadence de tir d'une réplique, mesurée en billes par seconde ou par minute.",
    category: "Mesure"
  },
  {
    term: "LiPo",
    definition: "Lithium Polymer - Type de batterie rechargeable couramment utilisée en airsoft.",
    category: "Équipement"
  },
  {
    term: "MED",
    definition: "Minimum Engagement Distance - Distance minimale de tir requise pour des répliques puissantes.",
    category: "Règles"
  },
  {
    term: "CQB",
    definition: "Close Quarters Battle - Combat rapproché, généralement en intérieur ou zones urbaines.",
    category: "Tactique"
  },
  {
    term: "Mosfet",
    definition: "Composant électronique qui protège les contacts du sélecteur de tir et permet des fonctions avancées.",
    category: "Technique"
  },
  {
    term: "Milsim",
    definition: "Military Simulation - Simulation militaire avec équipement et règles réalistes.",
    category: "Type de jeu"
  },
  {
    term: "Spring",
    definition: "Réplique à ressort nécessitant un réarmement manuel entre chaque tir.",
    category: "Équipement"
  },
  {
    term: "Bucking",
    definition: "Joint en caoutchouc du hop-up qui applique l'effet Magnus à la bille.",
    category: "Technique"
  },
  {
    term: "NPAS",
    definition: "Negative Pressure Air System - Système permettant d'ajuster la puissance des répliques GBB.",
    category: "Technique"
  },
  {
    term: "Sear",
    definition: "Pièce mécanique qui retient le piston avant le tir dans une gearbox.",
    category: "Technique"
  },
  {
    term: "Cut-off lever",
    definition: "Levier qui arrête le cycle de la gearbox en mode semi-auto.",
    category: "Technique"
  },
  {
    term: "Anti-reversal latch",
    definition: "Cliquet anti-retour qui empêche la gearbox de tourner en sens inverse.",
    category: "Technique"
  },
  {
    term: "Delayer chip",
    definition: "Pièce qui retarde l'alimentation des billes pour éviter les bourages.",
    category: "Technique"
  },
  {
    term: "Tappet plate",
    definition: "Plaque qui synchronise l'alimentation des billes avec le cycle de la gearbox.",
    category: "Technique"
  },
  {
    term: "HPA",
    definition: "High Pressure Air - Système utilisant de l'air comprimé pour propulser les billes, offrant une cadence et une précision élevées.",
    category: "Équipement"
  },
  {
    term: "Green Gas",
    definition: "Mélange gazeux à base de propane utilisé pour alimenter les répliques à gaz.",
    category: "Équipement"
  },
  {
    term: "Blowback",
    definition: "Système de recul simulant le mouvement de la culasse sur les répliques à gaz ou électriques.",
    category: "Technique"
  },
  {
    term: "Speedloader",
    definition: "Accessoire permettant de charger rapidement les chargeurs de répliques.",
    category: "Accessoire"
  },
  {
    term: "Réglage VSR",
    definition: "Méthode de réglage précis du hop-up basée sur le système VSR-10 de Tokyo Marui.",
    category: "Technique"
  },
  {
    term: "Shimming",
    definition: "Ajustement précis des engrenages dans une gearbox pour optimiser son fonctionnement.",
    category: "Maintenance"
  },
  {
    term: "AOE",
    definition: "Angle of Engagement - Angle de contact entre les dents du piston et du secteur gear, crucial pour l'efficacité mécanique.",
    category: "Technique"
  },
  {
    term: "Reshim",
    definition: "Procédure de réajustement des cales d'engrenages pour optimiser le fonctionnement de la gearbox.",
    category: "Maintenance"
  },
  {
    term: "R-hop",
    definition: "Modification avancée du hop-up offrant une meilleure stabilité et portée des billes.",
    category: "Technique"
  },
  {
    term: "IPSC",
    definition: "International Practical Shooting Confederation - Type de compétition de tir dynamique adaptée à l'airsoft.",
    category: "Compétition"
  },
  {
    term: "UKARA",
    definition: "United Kingdom Airsoft Retailers Association - Système de régulation britannique pour l'achat de répliques.",
    category: "Réglementation"
  },
  {
    term: "TDM",
    definition: "Team Death Match - Format de jeu où deux équipes s'affrontent jusqu'à élimination ou limite de temps.",
    category: "Type de jeu"
  },
  {
    term: "BBs",
    definition: "Désignation courante des billes d'airsoft, généralement en plastique et de différents poids.",
    category: "Équipement"
  },
  {
    term: "Joule Creep",
    definition: "Phénomène où l'énergie cinétique d'une bille augmente au-delà de la valeur mesurée au chronographe.",
    category: "Technique"
  }
];

const AirsoftGlossary = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = glossaryItems.filter(item => 
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5 text-airsoft-red" />
          Glossaire Airsoft
        </CardTitle>
        <CardDescription>
          Recherchez des termes et définitions du monde de l'airsoft
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un terme..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {filteredItems.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-semibold text-lg">{item.term}</h3>
                  <p className="text-sm text-muted-foreground">{item.definition}</p>
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 bg-muted rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default AirsoftGlossary;
