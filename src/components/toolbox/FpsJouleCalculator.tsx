import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gauge } from 'lucide-react';

const FpsJouleCalculator = () => {
  const [fps, setFps] = useState(0);
  const [joules, setJoules] = useState(0);
  const [mode, setMode] = useState<'fps' | 'joule'>('joule');
  const commonBBWeights = [0.20, 0.23, 0.25, 0.28, 0.30, 0.32, 0.36, 0.40, 0.43, 0.45];

  const calculateFpsToJoules = (fps: number, weight: number) => {
    const velocity = fps * 0.3048;
    const energy = 0.5 * (weight / 1000) * velocity * velocity;
    return energy;
  };

  const calculateJoulesToFps = (joules: number, weight: number) => {
    const velocity = Math.sqrt(2 * joules / (weight / 1000));
    return velocity / 0.3048;
  };

  const getEffectiveRange = (fps: number, weight: number) => {
    // Estimation basée sur des données empiriques
    const baseRange = fps * 0.4; // Base de calcul
    const weightMultiplier = weight * 2.5; // Plus la bille est lourde, plus elle garde sa trajectoire
    const effectiveRange = Math.round(baseRange * weightMultiplier);
    const maxRange = Math.round(effectiveRange * 1.5);
    return { effectiveRange, maxRange };
  };

  useEffect(() => {
    if (mode === 'fps' && fps > 0) {
      setJoules(Number(calculateFpsToJoules(fps, 0.20).toFixed(2)));
    } else if (mode === 'joule' && joules > 0) {
      setFps(Math.round(calculateJoulesToFps(joules, 0.20)));
    }
  }, [fps, joules, mode]);

  const getReplicaType = (joules: number) => {
    if (joules <= 1.0) return { type: 'CQB', color: 'bg-gradient-to-r from-green-400 to-green-550' };
    if (joules <= 1.14) return { type: 'Fusils d\'assaut', color: 'bg-gradient-to-r from-blue-400 to-blue-550' };
    if (joules <= 1.6) return { type: 'DMR', color: 'bg-gradient-to-r from-orange-400 to-orange-550' };
    if (joules <= 1.8) return { type: 'Tireur d\'élite', color: 'bg-gradient-to-r from-red-400 to-red-550' };
    return { type: 'Tireur d\'élite', color: 'bg-gradient-to-r from-red-600 to-red-850' };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-airsoft-red" />
          Calculateur FPS/Joule
        </CardTitle>
        <CardDescription>
          Convertissez les FPS en Joules et vice-versa avec différents poids de billes
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <Tabs value={mode} onValueChange={v => setMode(v as 'fps' | 'joule')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="joule">Joule</TabsTrigger>
              <TabsTrigger value="fps">FPS</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            {mode === 'fps' ? (
              <div>
                <Label>Vitesse de la bille (FPS)</Label>
                <div className="mt-2">
                  <Slider 
                    value={[fps]} 
                    min={0} 
                    max={750} 
                    step={1} 
                    onValueChange={value => setFps(value[0])} 
                    className="py-4" 
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0</span>
                    <span>750</span>
                  </div>
                </div>
                <div className="mt-2 text-right text-airsoft-red">{fps} fps</div>
              </div>
            ) : (
              <div>
                <Label>Énergie cinétique de la bille (Joules)</Label>
                <div className="mt-2">
                  <Slider 
                    value={[joules * 100]} 
                    min={0} 
                    max={300} 
                    step={1} 
                    onValueChange={value => setJoules(value[0] / 100)} 
                    className="py-4" 
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0.00</span>
                    <span>4.00</span>
                  </div>
                </div>
                <div className="mt-2 text-right text-airsoft-red">{joules.toFixed(2)}J</div>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Type de réplique</Label>
              <span className="text-airsoft-red">{getReplicaType(joules).type}</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${getReplicaType(joules).color}`}
                style={{
                  width: `${Math.min(joules / 3 * 100, 100)}%`
                }} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Vitesse convertie:</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted p-2 rounded">
                <span className="text-sm text-muted-foreground">Mètres/seconde:</span>
                <p className="font-medium">{(fps * 0.3048).toFixed(2)} m/s</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-sm text-muted-foreground">Pieds/seconde:</span>
                <p className="font-medium">{fps} fps</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Estimation de la portée (avec bille de 0.20g):</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted p-2 rounded">
                <span className="text-sm text-muted-foreground">Portée efficace:</span>
                <p className="font-medium">{getEffectiveRange(fps, 0.20).effectiveRange}m</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <span className="text-sm text-muted-foreground">Portée maximale:</span>
                <p className="font-medium">{getEffectiveRange(fps, 0.20).maxRange}m</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Vitesse par poids de bille:</Label>
            {commonBBWeights.map(weight => (
              <div key={weight} className="flex justify-between bg-muted p-2 rounded">
                <span>{weight.toFixed(2)}g</span>
                <span>{Math.round(calculateJoulesToFps(joules, weight))} fps</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FpsJouleCalculator;
