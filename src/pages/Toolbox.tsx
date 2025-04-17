
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calculator, 
  Wrench, 
  Gauge, 
  Zap, 
  ChevronRight, 
  BarChart4, 
  Settings, 
  Ruler, 
  Info
} from 'lucide-react';

const Toolbox = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
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
              <TabsTrigger value="troubleshooting" className="flex items-center gap-1">
                <Settings className="h-4 w-4" /> Dépannage
              </TabsTrigger>
              <TabsTrigger value="guides" className="flex items-center gap-1">
                <Info className="h-4 w-4" /> Guides
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calculators">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-airsoft-red" />
                      Calculateur de FPS/Joule
                    </CardTitle>
                    <CardDescription>
                      Convertissez les FPS en Joules et vice-versa
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fps">FPS (avec bille de 0.20g)</Label>
                        <Input id="fps" placeholder="350" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="joules">Énergie (Joules)</Label>
                        <Input id="joules" placeholder="1.14" type="number" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Calculer</Button>
                  </CardFooter>
                </Card>

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
                        <Input id="gearTeeth" placeholder="16" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pistonTeeth">Dents de piston</Label>
                        <Input id="pistonTeeth" placeholder="14" type="number" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Calculer</Button>
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
                        <Input id="batteryVoltage" placeholder="11.1" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="motorType">Type de moteur</Label>
                        <Input id="motorType" placeholder="High Speed" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Vérifier</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="troubleshooting">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Guide de dépannage des répliques</h2>
                
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <Button variant="link" className="p-0 h-auto text-left font-medium text-lg w-full flex justify-between items-center">
                      <span>Problèmes d'alimentation</span>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="border-b pb-4">
                    <Button variant="link" className="p-0 h-auto text-left font-medium text-lg w-full flex justify-between items-center">
                      <span>Problèmes de tir</span>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="border-b pb-4">
                    <Button variant="link" className="p-0 h-auto text-left font-medium text-lg w-full flex justify-between items-center">
                      <span>Problèmes de gearbox</span>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="border-b pb-4">
                    <Button variant="link" className="p-0 h-auto text-left font-medium text-lg w-full flex justify-between items-center">
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
                    <Button className="w-full">Lire le guide</Button>
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
                    <Button className="w-full">Lire le guide</Button>
                  </CardFooter>
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
