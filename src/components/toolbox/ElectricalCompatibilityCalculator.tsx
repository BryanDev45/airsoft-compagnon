
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const ElectricalCompatibilityCalculator = () => {
  const [batteryVoltage, setBatteryVoltage] = useState<string>('');
  const [motorType, setMotorType] = useState<string>('');
  const [compatibilityResult, setCompatibilityResult] = useState<string>('');

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

  return (
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
  );
};

export default ElectricalCompatibilityCalculator;
