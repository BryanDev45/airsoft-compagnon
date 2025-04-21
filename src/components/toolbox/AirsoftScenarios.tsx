
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
    },
    {
      title: "Contrôle de zone",
      duration: "20-40 min",
      players: "12-24",
      description: "Les équipes s'affrontent pour contrôler une zone centrale pendant une durée déterminée.",
      rules: [
        "Points accordés pour chaque minute de contrôle",
        "Réapparition à la base après élimination",
        "La zone doit être clairement définie"
      ]
    },
    {
      title: "Recherche & Destruction",
      duration: "30-45 min",
      players: "14-28",
      description: "Une équipe doit placer et défendre une bombe, l'autre doit la désamorcer.",
      rules: [
        "Temps limité pour placer la bombe",
        "La bombe explose après 5 minutes si non désamorcée",
        "Pas de réapparition une fois la bombe placée"
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
    },
    {
      title: "Extraction d'otages",
      duration: "3-4h",
      players: "24-40",
      description: "Une équipe doit extraire des otages détenus par l'équipe adverse en utilisant des tactiques discrètes.",
      rules: [
        "Les otages doivent être escortés jusqu'à la zone d'extraction",
        "Les défenseurs ont des positions fortifiées",
        "Système de renseignements et de reconnaissance"
      ]
    },
    {
      title: "Opération Blackout",
      duration: "5-7h",
      players: "30-50",
      description: "Opération nocturne où les équipes doivent accomplir des objectifs secrets tout en évitant d'être détectées.",
      rules: [
        "Utilisation obligatoire de lampes tactiques ou NVG",
        "Objectifs révélés progressivement",
        "Système de patrouilles et d'alarmes"
      ]
    }
  ],
  survival: [
    {
      title: "Last Man Standing",
      duration: "3-5h",
      players: "40+",
      description: "Tous les joueurs commencent avec 3 vies et s'affrontent jusqu'à ce qu'il ne reste qu'un seul survivant.",
      rules: [
        "Zone de jeu qui se réduit progressivement",
        "Ravitaillement limité accessible à certains points",
        "Alliances temporaires autorisées mais un seul gagnant à la fin"
      ]
    },
    {
      title: "Infection Z",
      duration: "2-4h",
      players: "30+",
      description: "Quelques joueurs commencent comme 'infectés' et doivent contaminer les survivants.",
      rules: [
        "Les infectés ont des vies illimitées",
        "Les survivants doivent accomplir des objectifs pour s'échapper",
        "Les survivants infectés rejoignent l'équipe des infectés"
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

            <AccordionItem value="survival">
              <AccordionTrigger>Survie & Événements spéciaux</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {scenarios.survival.map((scenario, index) => (
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
