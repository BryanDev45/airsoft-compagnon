
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Battery } from 'lucide-react';

const BatteryCalculator = () => {
  const [batteryCapacity, setBatteryCapacity] = useState('');
  const [motorCurrent, setMotorCurrent] = useState('');
  const [fireRate, setFireRate] = useState('');

  const calculateBatteryLife = () => {
    const capacity = parseFloat(batteryCapacity);
    const current = parseFloat(motorCurrent);
    const rate = parseFloat(fireRate);

    if (!capacity || !current || !rate) return null;

    // Calcul simplifié de l'autonomie
    const hoursOfContinuousFire = capacity / (current * 1000);
    const shotsPerHour = rate * 3600;
    const totalShots = Math.round(hoursOfContinuousFire * shotsPerHour);
    const batteryLifeMinutes = Math.round(hoursOfContinuousFire * 60);

    return { totalShots, batteryLifeMinutes };
  };

  const result = calculateBatteryLife();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Battery className="h-5 w-5 text-airsoft-red" />
          Calculateur d'autonomie de batterie
        </CardTitle>
        <CardDescription>
          Estimez l'autonomie de votre batterie en fonction de votre équipement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Capacité de la batterie (mAh)</Label>
            <Input 
              type="number" 
              placeholder="1200" 
              value={batteryCapacity}
              onChange={(e) => setBatteryCapacity(e.target.value)}
            />
          </div>

          <div>
            <Label>Consommation moteur (A)</Label>
            <Input 
              type="number" 
              placeholder="15" 
              value={motorCurrent}
              onChange={(e) => setMotorCurrent(e.target.value)}
            />
          </div>

          <div>
            <Label>Cadence de tir (billes/sec)</Label>
            <Input 
              type="number" 
              placeholder="20" 
              value={fireRate}
              onChange={(e) => setFireRate(e.target.value)}
            />
          </div>

          {result && (
            <div className="space-y-2 mt-4">
              <div className="bg-muted p-3 rounded">
                <span className="text-sm text-muted-foreground">Autonomie estimée:</span>
                <p className="font-medium">{result.batteryLifeMinutes} minutes</p>
              </div>
              <div className="bg-muted p-3 rounded">
                <span className="text-sm text-muted-foreground">Nombre de billes estimé:</span>
                <p className="font-medium">{result.totalShots} billes</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BatteryCalculator;
