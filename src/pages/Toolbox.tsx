
import React, { useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs as TabsRadix } from "@radix-ui/react-tabs";
import {
  CalculatorIcon,
  Zap,
  Activity,
  Settings,
  AlertCircle,
  ArrowRight,
  Battery,
  Tool,
  Search,
  FileText,
  Wrench,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Toolbox = () => {
  // FPS Calculator
  const [mass, setMass] = useState(0.20);
  const [fps, setFps] = useState(350);
  const [joules, setJoules] = useState('');
  
  // Joules Calculator
  const [bbbMass, setBbbMass] = useState(0.20);
  const [energy, setEnergy] = useState(1.0);
  const [calculatedFps, setCalculatedFps] = useState('');
  
  // Hop-Up Estimator
  const [bbWeight, setBbWeight] = useState(0.20);
  const [desiredRange, setDesiredRange] = useState(50);
  const [hopUpSetting, setHopUpSetting] = useState('');

  // Calculate FPS to Joules
  const calculateJoules = () => {
    // E = 0.5 * m * v²
    // m in kg, v in m/s
    // 1 fps = 0.3048 m/s
    const massInKg = mass / 1000;
    const velocityInMps = fps * 0.3048;
    const joulesValue = 0.5 * massInKg * Math.pow(velocityInMps, 2);
    
    setJoules(joulesValue.toFixed(2));
    toast({
      title: "Calcul effectué",
      description: `${fps} FPS avec un BB de ${mass}g équivaut à ${joulesValue.toFixed(2)} joules.`
    });
  };

  // Calculate Joules to FPS
  const calculateFps = () => {
    // v = sqrt(2 * E / m)
    // v in m/s, convert to fps
    const massInKg = bbbMass / 1000;
    const velocityInMps = Math.sqrt(2 * energy / massInKg);
    const fpsValue = velocityInMps / 0.3048;
    
    setCalculatedFps(fpsValue.toFixed(0));
    toast({
      title: "Calcul effectué",
      description: `${energy} joules avec un BB de ${bbbMass}g équivaut à ${fpsValue.toFixed(0)} FPS.`
    });
  };

  // Estimate Hop-Up setting
  const estimateHopUp = () => {
    // This is a simplified model based on BB weight and desired range
    // In a real application, this would be more complex
    const setting = ((bbWeight - 0.20) * 100) + (desiredRange / 10);
    const normalizedSetting = Math.min(Math.max(setting, 0), 10).toFixed(1);
    
    setHopUpSetting(normalizedSetting);
    toast({
      title: "Estimation effectuée",
      description: `Pour un BB de ${bbWeight}g et une portée de ${desiredRange}m, réglez votre hop-up sur environ ${normalizedSetting}/10.`
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">ToolBox Airsoft</h1>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Des outils pratiques pour les joueurs d'airsoft. Calculez la puissance de vos répliques,
            diagnostiquez les problèmes et obtenez des conseils pour l'entretien de votre équipement.
          </p>

          <Tabs defaultValue="calculators" className="space-y-8">
            <TabsList className="grid grid-cols-3 max-w-2xl mx-auto">
              <TabsTrigger value="calculators" className="flex items-center gap-2">
                <CalculatorIcon className="h-4 w-4" /> Calculateurs
              </TabsTrigger>
              <TabsTrigger value="troubleshooting" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Dépannage
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" /> Entretien
              </TabsTrigger>
            </TabsList>

            {/* Calculators Tab */}
            <TabsContent value="calculators">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* FPS to Joules Calculator */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-airsoft-red" />
                      FPS vers Joules
                    </CardTitle>
                    <CardDescription>
                      Convertissez la vitesse (FPS) en énergie (joules)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bb-mass">Masse du BB (g)</Label>
                      <Select value={mass.toString()} onValueChange={(val) => setMass(parseFloat(val))}>
                        <SelectTrigger id="bb-mass">
                          <SelectValue placeholder="Sélectionnez le poids" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.12">0.12g</SelectItem>
                          <SelectItem value="0.20">0.20g</SelectItem>
                          <SelectItem value="0.23">0.23g</SelectItem>
                          <SelectItem value="0.25">0.25g</SelectItem>
                          <SelectItem value="0.28">0.28g</SelectItem>
                          <SelectItem value="0.30">0.30g</SelectItem>
                          <SelectItem value="0.36">0.36g</SelectItem>
                          <SelectItem value="0.40">0.40g</SelectItem>
                          <SelectItem value="0.45">0.45g</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fps-input">Vitesse (FPS)</Label>
                      <Input 
                        id="fps-input" 
                        type="number" 
                        value={fps} 
                        onChange={(e) => setFps(parseInt(e.target.value) || 0)} 
                        placeholder="Ex: 350"
                      />
                    </div>
                    <Button 
                      className="w-full bg-airsoft-red hover:bg-red-700" 
                      onClick={calculateJoules}
                    >
                      Calculer
                    </Button>
                    {joules && (
                      <div className="mt-4 p-3 bg-gray-100 rounded-md">
                        <p className="font-semibold">Résultat: {joules} joules</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Joules to FPS Calculator */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-airsoft-red" />
                      Joules vers FPS
                    </CardTitle>
                    <CardDescription>
                      Convertissez l'énergie (joules) en vitesse (FPS)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bbb-mass">Masse du BB (g)</Label>
                      <Select value={bbbMass.toString()} onValueChange={(val) => setBbbMass(parseFloat(val))}>
                        <SelectTrigger id="bbb-mass">
                          <SelectValue placeholder="Sélectionnez le poids" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.12">0.12g</SelectItem>
                          <SelectItem value="0.20">0.20g</SelectItem>
                          <SelectItem value="0.23">0.23g</SelectItem>
                          <SelectItem value="0.25">0.25g</SelectItem>
                          <SelectItem value="0.28">0.28g</SelectItem>
                          <SelectItem value="0.30">0.30g</SelectItem>
                          <SelectItem value="0.36">0.36g</SelectItem>
                          <SelectItem value="0.40">0.40g</SelectItem>
                          <SelectItem value="0.45">0.45g</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="joules-input">Énergie (joules)</Label>
                      <Input 
                        id="joules-input"
                        type="number"
                        step="0.01"
                        value={energy}
                        onChange={(e) => setEnergy(parseFloat(e.target.value) || 0)}
                        placeholder="Ex: 1.0"
                      />
                    </div>
                    <Button 
                      className="w-full bg-airsoft-red hover:bg-red-700" 
                      onClick={calculateFps}
                    >
                      Calculer
                    </Button>
                    {calculatedFps && (
                      <div className="mt-4 p-3 bg-gray-100 rounded-md">
                        <p className="font-semibold">Résultat: {calculatedFps} FPS</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Hop-Up Estimator */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-airsoft-red" />
                      Estimateur Hop-Up
                    </CardTitle>
                    <CardDescription>
                      Estimation de réglage du hop-up selon le poids et la portée
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bb-weight">Masse du BB (g)</Label>
                      <Select value={bbWeight.toString()} onValueChange={(val) => setBbWeight(parseFloat(val))}>
                        <SelectTrigger id="bb-weight">
                          <SelectValue placeholder="Sélectionnez le poids" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.20">0.20g</SelectItem>
                          <SelectItem value="0.23">0.23g</SelectItem>
                          <SelectItem value="0.25">0.25g</SelectItem>
                          <SelectItem value="0.28">0.28g</SelectItem>
                          <SelectItem value="0.30">0.30g</SelectItem>
                          <SelectItem value="0.36">0.36g</SelectItem>
                          <SelectItem value="0.40">0.40g</SelectItem>
                          <SelectItem value="0.45">0.45g</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="range-slider">Portée désirée: {desiredRange} m</Label>
                      </div>
                      <Slider
                        id="range-slider"
                        min={20}
                        max={80}
                        step={5}
                        value={[desiredRange]}
                        onValueChange={(val) => setDesiredRange(val[0])}
                      />
                    </div>
                    <Button 
                      className="w-full bg-airsoft-red hover:bg-red-700" 
                      onClick={estimateHopUp}
                    >
                      Estimer
                    </Button>
                    {hopUpSetting && (
                      <div className="mt-4 p-3 bg-gray-100 rounded-md">
                        <p className="font-semibold">Réglage suggéré: {hopUpSetting}/10</p>
                        <p className="text-sm text-gray-600 mt-1">Ce réglage est indicatif et peut varier selon la réplique</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Troubleshooting Tab */}
            <TabsContent value="troubleshooting">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Guide de dépannage des répliques</CardTitle>
                    <CardDescription>
                      Diagnostiquez et résolvez les problèmes courants de vos répliques d'airsoft
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs className="space-y-6">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="feeding">Alimentation</TabsTrigger>
                        <TabsTrigger value="power">Puissance</TabsTrigger>
                        <TabsTrigger value="accuracy">Précision</TabsTrigger>
                      </TabsList>

                      <TabsContent value="feeding" className="space-y-4">
                        <h3 className="text-lg font-semibold">Problèmes d'alimentation</h3>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Réplique ne tire pas ou s'enraye</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Vérifiez que le chargeur est correctement inséré</li>
                            <li>Assurez-vous que les BBs sont correctement chargés</li>
                            <li>Inspectez le ressort du chargeur</li>
                            <li>Nettoyez la chambre hop-up et le canon</li>
                            <li>Vérifiez l'état de la nozzle et du joint</li>
                          </ul>
                          <Button variant="link" className="text-airsoft-red p-0 h-auto mt-2">
                            Guide détaillé <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Double alimentation (deux BBs à la fois)</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Vérifiez l'état du joint de hop-up</li>
                            <li>Inspectez le bucking pour d'éventuelles déchirures</li>
                            <li>Ajustez la tension du ressort de nozzle</li>
                            <li>Assurez-vous que le chargeur est compatible</li>
                          </ul>
                          <Button variant="link" className="text-airsoft-red p-0 h-auto mt-2">
                            Guide détaillé <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="power" className="space-y-4">
                        <h3 className="text-lg font-semibold">Problèmes de puissance</h3>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Batterie se décharge rapidement</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Vérifiez l'état général de la batterie</li>
                            <li>Inspectez les connexions électriques</li>
                            <li>Recherchez des résistances mécaniques dans la gearbox</li>
                            <li>Testez avec une autre batterie si possible</li>
                          </ul>
                          <Button variant="link" className="text-airsoft-red p-0 h-auto mt-2">
                            Guide détaillé <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Perte de puissance (FPS bas)</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Vérifiez l'étanchéité du cylindre et du piston</li>
                            <li>Inspectez l'état du joint de tête de cylindre</li>
                            <li>Vérifiez le ressort du piston (usure, fatigue)</li>
                            <li>Assurez-vous que le canon n'est pas obstrué</li>
                            <li>Vérifiez les fuites potentielles au niveau du hop-up</li>
                          </ul>
                          <Button variant="link" className="text-airsoft-red p-0 h-auto mt-2">
                            Guide détaillé <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="accuracy" className="space-y-4">
                        <h3 className="text-lg font-semibold">Problèmes de précision</h3>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">BBs partent dans des directions aléatoires</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Nettoyez le canon avec de l'alcool isopropylique</li>
                            <li>Vérifiez la qualité des BBs utilisés</li>
                            <li>Inspectez l'état du bucking et du nub</li>
                            <li>Vérifiez l'alignement du barrel avec le hop-up</li>
                            <li>Assurez-vous que le canon n'est pas endommagé</li>
                          </ul>
                          <Button variant="link" className="text-airsoft-red p-0 h-auto mt-2">
                            Guide détaillé <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Portée réduite</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Ajustez le réglage du hop-up</li>
                            <li>Essayez des BBs de poids différents</li>
                            <li>Vérifiez la compression dans la gearbox</li>
                            <li>Inspectez l'état du bucking</li>
                            <li>Considérez un upgrade du barrel ou du hop-up</li>
                          </ul>
                          <Button variant="link" className="text-airsoft-red p-0 h-auto mt-2">
                            Guide détaillé <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Maintenance Tab */}
            <TabsContent value="maintenance">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tool className="h-5 w-5 text-airsoft-red" />
                      Guides d'entretien
                    </CardTitle>
                    <CardDescription>
                      Conseils pour maintenir vos répliques en parfait état
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <h3 className="font-medium flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-airsoft-red" />
                        Nettoyage du canon et du hop-up
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Procédure détaillée pour nettoyer correctement le canon et le système hop-up
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <h3 className="font-medium flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-airsoft-red" />
                        Lubrification de la gearbox
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Types de lubrifiants à utiliser et points de lubrification
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <h3 className="font-medium flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-airsoft-red" />
                        Entretien et stockage des batteries
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Maximiser la durée de vie de vos batteries LiPo, NiMH et autres
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <h3 className="font-medium flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-airsoft-red" />
                        Remplacement du bucking
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Guide étape par étape pour remplacer le bucking de hop-up
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-airsoft-red" />
                      Diagnostics vidéo
                    </CardTitle>
                    <CardDescription>
                      Tutoriels vidéo pour identifier et résoudre les problèmes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg bg-gray-100 p-4 flex flex-col items-center justify-center h-[280px]">
                      <Battery className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-center text-gray-500">
                        Bientôt disponible : des tutoriels vidéo pour vous aider à diagnostiquer et réparer vos répliques.
                      </p>
                      <Button variant="outline" className="mt-4">
                        S'inscrire aux notifications
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Toolbox;
