
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Target } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const scenarios = {
  short: [
    {
      title: "Capture de drapeau",
      duration: "15-30 min",
      players: "10-20",
      description: "Deux équipes doivent capturer le drapeau adverse tout en protégeant le leur.",
      rules: [
        "Une équipe gagne en ramenant le drapeau adverse à sa base",
        "Les joueurs éliminés reviennent en jeu après 5 minutes",
        "Le drapeau doit rester visible"
      ]
    },
    {
      title: "Dernier survivant",
      duration: "10-20 min",
      players: "8-16",
      description: "Tous contre tous jusqu'au dernier joueur en vie.",
      rules: [
        "Pas de réapparition",
        "Zone de jeu qui se réduit toutes les 5 minutes",
        "Pas d'alliance autorisée"
      ]
    }
  ],
  operations: [
    {
      title: "Escorte VIP",
      duration: "2-3h",
      players: "20+",
      description: "Une équipe doit escorter un VIP à travers plusieurs points de contrôle pendant que l'autre équipe tente de l'intercepter.",
      rules: [
        "Le VIP a 3 vies",
        "Points de respawn mobiles",
        "Objectifs secondaires donnant des avantages"
      ]
    },
    {
      title: "Guerre de territoire",
      duration: "4-6h",
      players: "30+",
      description: "Les équipes s'affrontent pour le contrôle de points stratégiques sur la carte.",
      rules: [
        "Points de contrôle à capturer",
        "Système de ressources",
        "Missions secondaires dynamiques"
      ]
    }
  ]
};

const AirsoftScenarios = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-airsoft-red" />
          Scénarios de jeu
        </CardTitle>
        <CardDescription>
          Découvrez différents scénarios pour vos parties d'airsoft
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="short">
              <AccordionTrigger>Parties courtes</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {scenarios.short.map((scenario, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">{scenario.title}</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{scenario.description}</p>
                        <div className="flex gap-2">
                          <span className="text-xs px-2 py-1 bg-muted rounded-full">
                            {scenario.duration}
                          </span>
                          <span className="text-xs px-2 py-1 bg-muted rounded-full">
                            {scenario.players} joueurs
                          </span>
                        </div>
                        <ul className="text-sm list-disc list-inside mt-2">
                          {scenario.rules.map((rule, ruleIndex) => (
                            <li key={ruleIndex}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="operations">
              <AccordionTrigger>Opérations</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {scenarios.operations.map((scenario, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">{scenario.title}</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{scenario.description}</p>
                        <div className="flex gap-2">
                          <span className="text-xs px-2 py-1 bg-muted rounded-full">
                            {scenario.duration}
                          </span>
                          <span className="text-xs px-2 py-1 bg-muted rounded-full">
                            {scenario.players} joueurs
                          </span>
                        </div>
                        <ul className="text-sm list-disc list-inside mt-2">
                          {scenario.rules.map((rule, ruleIndex) => (
                            <li key={ruleIndex}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AirsoftScenarios;
