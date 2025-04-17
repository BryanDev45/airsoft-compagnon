import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Wrench, Book, Target, Settings, Info, Zap, ChevronRight, BarChart4, Ruler } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import FpsJouleCalculator from '../components/toolbox/FpsJouleCalculator';
import BatteryCalculator from '../components/toolbox/BatteryCalculator';
import AirsoftGlossary from '../components/toolbox/AirsoftGlossary';
import AirsoftScenarios from '../components/toolbox/AirsoftScenarios';

const Toolbox = () => {
  // États pour les calculateurs
  const [fps, setFps] = useState<string>('');
  const [joules, setJoules] = useState<string>('');
  const [gearTeeth, setGearTeeth] = useState<string>('');
  const [pistonTeeth, setPistonTeeth] = useState<string>('');
  const [gearRatio, setGearRatio] = useState<string>('');
  const [batteryVoltage, setBatteryVoltage] = useState<string>('');
  const [motorType, setMotorType] = useState<string>('');
  const [compatibilityResult, setCompatibilityResult] = useState<string>('');

  // Fonction pour calculer les Joules à partir des FPS
  const calculateJoules = () => {
    if (!fps || isNaN(Number(fps))) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une valeur FPS valide",
        variant: "destructive"
      });
      return;
    }
    const fpsValue = Number(fps);
    // Formule pour calculer les Joules à partir des FPS avec une bille de 0.20g
    // E(J) = 0.5 * m * v^2, où m est en kg et v en m/s
    // 1 FPS = 0.3048 m/s, m = 0.00020 kg (0.20g)
    const velocity = fpsValue * 0.3048; // conversion en m/s
    const energy = 0.5 * 0.00020 * velocity * velocity;
    setJoules(energy.toFixed(2));
    toast({
      title: "Calcul effectué",
      description: `${fpsValue} FPS = ${energy.toFixed(2)} Joules`
    });
  };

  // Fonction pour calculer les FPS à partir des Joules
  const calculateFPS = () => {
    if (!joules || isNaN(Number(joules))) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une valeur en Joules valide",
        variant: "destructive"
      });
      return;
    }
    const joulesValue = Number(joules);
    // Formule inverse: v = sqrt(2 * E / m), puis conversion en FPS
    const velocity = Math.sqrt(2 * joulesValue / 0.00020);
    const fpsValue = velocity / 0.3048;
    setFps(fpsValue.toFixed(0));
    toast({
      title: "Calcul effectué",
      description: `${joulesValue} Joules = ${fpsValue.toFixed(0)} FPS`
    });
  };

  // Fonction pour calculer le rapport de démultiplication
  const calculateGearRatio = () => {
    if (!gearTeeth || !pistonTeeth || isNaN(Number(gearTeeth)) || isNaN(Number(pistonTeeth))) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer des valeurs valides pour les dents",
        variant: "destructive"
      });
      return;
    }
    const gearValue = Number(gearTeeth);
    const pistonValue = Number(pistonTeeth);
    const ratio = (gearValue / pistonValue).toFixed(2);
    setGearRatio(ratio);
    toast({
      title: "Calcul effectué",
      description: `Rapport de démultiplication: ${ratio}:1`
    });
  };

  // Vérification de compatibilité électrique
  const checkElectricalCompatibility = () => {
    if (!batteryVoltage || isNaN(Number(batteryVoltage)) || !motorType) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs avec des valeurs valides",
        variant: "destructive"
      });
      return;
    }
    const voltage = Number(batteryVoltage);
    let result = "";
    if (motorType.toLowerCase().includes("high speed") || motorType.toLowerCase().includes("rapide")) {
      if (voltage <= 7.4) {
        result = "Compatible - Configuration idéale pour un moteur rapide";
      } else if (voltage <= 11.1) {
        result = "Compatible avec précaution - Risque d'usure accélérée";
      } else {
        result = "Non recommandé - Tension trop élevée pour ce type de moteur";
      }
    } else if (motorType.toLowerCase().includes("high torque") || motorType.toLowerCase().includes("couple")) {
      if (voltage >= 11.1) {
        result = "Compatible - Configuration idéale pour un moteur à couple élevé";
      } else if (voltage >= 7.4) {
        result = "Compatible - Performances acceptables";
      } else {
        result = "Compatible mais sous-optimal - Performances réduites";
      }
    } else if (motorType.toLowerCase().includes("balanced") || motorType.toLowerCase().includes("équilibré")) {
      if (voltage >= 7.4 && voltage <= 11.1) {
        result = "Compatible - Configuration idéale pour un moteur équilibré";
      } else if (voltage < 7.4) {
        result = "Compatible mais sous-optimal - Tension un peu faible";
      } else {
        result = "Compatible avec précaution - Tension un peu élevée";
      }
    } else {
      result = "Type de moteur non reconnu, veuillez spécifier 'High Speed', 'High Torque' ou 'Balanced'";
    }
    setCompatibilityResult(result);
    toast({
      title: "Vérification effectuée",
      description: result
    });
  };
  const handleFpsJouleCalculator = () => {
    if (fps && !joules) {
      calculateJoules();
    } else if (!fps && joules) {
      calculateFPS();
    } else if (fps && joules) {
      calculateJoules(); // Si les deux sont remplis, priorité au calcul à partir des FPS
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez remplir au moins un champ",
        variant: "destructive"
      });
    }
  };

  // Fonctions pour ouvrir les guides
  const openGuide = (guideType: string) => {
    toast({
      title: "Guide en cours de chargement",
      description: `Le guide sur ${guideType} sera bientôt disponible`
    });
  };

  // Fonctions pour ouvrir les solutions de dépannage
  const openTroubleshooting = (problemType: string) => {
    toast({
      title: "Solutions de dépannage",
      description: `Les solutions pour les problèmes de ${problemType} seront bientôt disponibles`
    });
  };
  return <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Wrench className="h-8 w-8 text-airsoft-red" />
              ToolBox Airsoft
            </h1>
            <p className="text-gray-600 mb-6">
              Outils et calculateurs pour vous aider dans votre pratique de l'airsoft
            </p>
          </div>

          <Tabs defaultValue="calculators" className="w-full">
            <TabsList className="mb-6 w-full justify-start overflow-x-auto">
              <TabsTrigger value="calculators" className="flex items-center gap-1">
                <Calculator className="h-4 w-4" /> Calculateurs
              </TabsTrigger>
              <TabsTrigger value="glossary" className="flex items-center gap-1">
                <Book className="h-4 w-4" /> Glossaire
              </TabsTrigger>
              <TabsTrigger value="scenarios" className="flex items-center gap-1">
                <Target className="h-4 w-4" /> Scénarios
              </TabsTrigger>
              <TabsTrigger value="troubleshooting" className="flex items-center gap-1">
                <Settings className="h-4 w-4" /> Dépannage
              </TabsTrigger>
              <TabsTrigger value="guides" className="flex items-center gap-1">
                <Info className="h-4 w-4" /> Guides
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calculators">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FpsJouleCalculator />
                <BatteryCalculator />
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart4 className="h-5 w-5 text-airsoft-red" />
                      Calculateur Rapport de Démultiplication
                    </CardTitle>
                    <CardDescription>
                      Calculez le rapport de démultiplication de votre réplique
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="gearTeeth">Dents d'engrenage</Label>
                        <Input id="gearTeeth" placeholder="16" type="number" value={gearTeeth} onChange={e => setGearTeeth(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pistonTeeth">Dents de piston</Label>
                        <Input id="pistonTeeth" placeholder="14" type="number" value={pistonTeeth} onChange={e => setPistonTeeth(e.target.value)} />
                      </div>
                      {gearRatio && <div className="pt-2">
                          <p className="text-sm font-medium">Résultat: <span className="text-airsoft-red">{gearRatio}:1</span></p>
                        </div>}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={calculateGearRatio}>Calculer</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-airsoft-red" />
                      Calculateur de Configuration Électrique
                    </CardTitle>
                    <CardDescription>
                      Vérifiez la compatibilité de votre configuration électrique
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="batteryVoltage">Voltage batterie (V)</Label>
                        <Input id="batteryVoltage" placeholder="11.1" type="number" value={batteryVoltage} onChange={e => setBatteryVoltage(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="motorType">Type de moteur</Label>
                        <Input id="motorType" placeholder="High Speed" value={motorType} onChange={e => setMotorType(e.target.value)} />
                        <p className="text-xs text-gray-500 mt-1">Ex: High Speed, High Torque, Balanced</p>
                      </div>
                      {compatibilityResult && <div className="pt-2">
                          <p className="text-sm">{compatibilityResult}</p>
                        </div>}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={checkElectricalCompatibility}>Vérifier</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="glossary">
              <AirsoftGlossary />
            </TabsContent>

            <TabsContent value="scenarios">
              <AirsoftScenarios />
            </TabsContent>

            <TabsContent value="troubleshooting">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Guide de dépannage des répliques</h2>
                
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <Button variant="link" className="p-0 h-auto text-left font-medium text-lg w-full flex justify-between items-center" onClick={() => openTroubleshooting("alimentation")}>
                      <span>Problèmes d'alimentation</span>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="border-b pb-4">
                    <Button variant="link" className="p-0 h-auto text-left font-medium text-lg w-full flex justify-between items-center" onClick={() => openTroubleshooting("tir")}>
                      <span>Problèmes de tir</span>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="border-b pb-4">
                    <Button variant="link" className="p-0 h-auto text-left font-medium text-lg w-full flex justify-between items-center" onClick={() => openTroubleshooting("gearbox")}>
                      <span>Problèmes de gearbox</span>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="border-b pb-4">
                    <Button variant="link" className="p-0 h-auto text-left font-medium text-lg w-full flex justify-between items-center" onClick={() => openTroubleshooting("hop-up")}>
                      <span>Problèmes de hop-up</span>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="guides">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-airsoft-red" />
                      Guide d'entretien des répliques
                    </CardTitle>
                    <CardDescription>
                      Comment entretenir vos répliques pour augmenter leur durée de vie
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Apprenez à nettoyer et entretenir vos répliques d'airsoft pour garantir leur performance et longévité.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => openGuide("entretien des répliques")}>Lire le guide</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ruler className="h-5 w-5 text-airsoft-red" />
                      Guide des mesures et standards
                    </CardTitle>
                    <CardDescription>
                      Les mesures et standards importants en airsoft
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Découvrez les mesures et standards utilisés en airsoft, des filetages aux dimensions des pièces.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => openGuide("mesures et standards")}>Lire le guide</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>;
};

export default Toolbox;
