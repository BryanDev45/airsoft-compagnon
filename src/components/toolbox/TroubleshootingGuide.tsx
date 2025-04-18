
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, AlertTriangle, Battery, Target, Settings, Wrench } from 'lucide-react';

const guides = {
  alimentation: {
    title: "Problèmes d'alimentation",
    sections: [
      {
        problem: "La batterie ne charge pas",
        solutions: [
          "Vérifier que le chargeur est compatible avec le type de batterie",
          "Inspecter les connecteurs pour des signes d'usure",
          "Mesurer la tension de la batterie avec un voltmètre",
          "Tester avec une autre batterie si possible"
        ]
      },
      {
        problem: "La réplique ne démarre pas",
        solutions: [
          "Vérifier que la batterie est correctement branchée",
          "Contrôler l'état des connecteurs",
          "Tester le fusible",
          "Vérifier les soudures du câblage"
        ]
      }
    ]
  },
  tir: {
    title: "Problèmes de tir",
    sections: [
      {
        problem: "Double alimentation",
        solutions: [
          "Ajuster le hop-up",
          "Vérifier le ressort du chargeur",
          "Inspecter le nozzle et son joint",
          "Contrôler l'état du tappet plate"
        ]
      },
      {
        problem: "Précision réduite",
        solutions: [
          "Nettoyer le canon interne",
          "Vérifier l'état du bucking",
          "Ajuster le hop-up",
          "Utiliser des billes de qualité"
        ]
      }
    ]
  },
  gearbox: {
    title: "Problèmes de gearbox",
    sections: [
      {
        problem: "Bruit anormal",
        solutions: [
          "Vérifier le shimming des gears",
          "Contrôler l'usure des engrenages",
          "Inspecter les roulements",
          "Vérifier la lubrification"
        ]
      },
      {
        problem: "Blocage mécanique",
        solutions: [
          "Vérifier l'anti-reversal latch",
          "Contrôler l'état du piston",
          "Inspecter les dents des engrenages",
          "Vérifier le cut-off lever"
        ]
      }
    ]
  },
  "hop-up": {
    title: "Problèmes de hop-up",
    sections: [
      {
        problem: "Effet hop-up inconsistant",
        solutions: [
          "Nettoyer l'ensemble hop-up",
          "Vérifier l'état du bucking",
          "Contrôler la tension du bras de hop-up",
          "Aligner correctement le nub"
        ]
      },
      {
        problem: "Bourrage de billes",
        solutions: [
          "Ajuster le hop-up",
          "Vérifier la compatibilité des billes",
          "Nettoyer le canon interne",
          "Contrôler l'alignement du hop-up"
        ]
      }
    ]
  }
};

const TroubleshootingGuide = () => {
  const [selectedGuide, setSelectedGuide] = React.useState<string | null>(null);

  return (
    <div className="space-y-6">
      {!selectedGuide ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedGuide('alimentation')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Battery className="h-5 w-5 text-airsoft-red" />
                Problèmes d'alimentation
              </CardTitle>
              <CardDescription>
                Solutions aux problèmes de batterie et d'alimentation électrique
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedGuide('tir')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-airsoft-red" />
                Problèmes de tir
              </CardTitle>
              <CardDescription>
                Résolution des problèmes de tir et de précision
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedGuide('gearbox')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-airsoft-red" />
                Problèmes de gearbox
              </CardTitle>
              <CardDescription>
                Diagnostic et réparation des problèmes mécaniques
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedGuide('hop-up')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-airsoft-red" />
                Problèmes de hop-up
              </CardTitle>
              <CardDescription>
                Solutions aux problèmes de trajectoire et d'alimentation
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{guides[selectedGuide].title}</h2>
            <Button variant="outline" onClick={() => setSelectedGuide(null)}>
              Retour
            </Button>
          </div>
          
          <div className="space-y-4">
            {guides[selectedGuide].sections.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{section.problem}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-2">
                    {section.solutions.map((solution, sIndex) => (
                      <li key={sIndex} className="text-gray-700">{solution}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TroubleshootingGuide;
