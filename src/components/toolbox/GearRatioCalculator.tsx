
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart4 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const GearRatioCalculator = () => {
  const [gearTeeth, setGearTeeth] = useState<string>('');
  const [pistonTeeth, setPistonTeeth] = useState<string>('');
  const [gearRatio, setGearRatio] = useState<string>('');

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

  return (
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
  );
};

export default GearRatioCalculator;
