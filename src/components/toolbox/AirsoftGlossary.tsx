
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
  }
  // ... Plus de termes peuvent être ajoutés ici
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
