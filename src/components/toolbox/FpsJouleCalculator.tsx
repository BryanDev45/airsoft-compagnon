import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const FpsJouleCalculator = () => {
  const [bbWeight, setBbWeight] = useState(0.20);
  const [fps, setFps] = useState(0);
  const [joules, setJoules] = useState(0);
  const [mode, setMode] = useState<'fps' | 'joule'>('joule');
  const commonBBWeights = [0.20, 0.25, 0.30, 0.36, 0.45];
  const calculateFpsToJoules = (fps: number, weight: number) => {
    const velocity = fps * 0.3048; // conversion en m/s
    const energy = 0.5 * (weight / 1000) * velocity * velocity;
    return energy;
  };
  const calculateJoulesToFps = (joules: number, weight: number) => {
    const velocity = Math.sqrt(2 * joules / (weight / 1000));
    return velocity / 0.3048;
  };
  useEffect(() => {
    if (mode === 'fps' && fps > 0) {
      setJoules(Number(calculateFpsToJoules(fps, bbWeight).toFixed(2)));
    } else if (mode === 'joule' && joules > 0) {
      setFps(Math.round(calculateJoulesToFps(joules, bbWeight)));
    }
  }, [fps, joules, bbWeight, mode]);
  const getCQBStatus = (joules: number) => {
    if (joules <= 1.0) return 'bg-green-500';
    if (joules <= 1.5) return 'bg-yellow-500';
    if (joules <= 2.0) return 'bg-orange-500';
    return 'bg-red-500';
  };
  return <Card className="w-full bg-gray-900 text-white">
      <CardHeader>
        <CardTitle className="text-cyan-400">Calculateur FPS/Joule</CardTitle>
        <CardDescription className="text-gray-400">
          Convertissez les FPS en Joules et vice-versa avec différents poids de billes
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs value={mode} onValueChange={v => setMode(v as 'fps' | 'joule')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="joule">Joule</TabsTrigger>
            <TabsTrigger value="fps">FPS</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          <div>
            <Label className="text-gray-300">Poids de la bille BB</Label>
            <div className="mt-2">
              <Slider value={[bbWeight * 100]} min={20} max={50} step={1} onValueChange={value => setBbWeight(value[0] / 100)} className="py-4" />
              <div className="flex justify-between text-sm text-gray-400">
                <span>0.20</span>
                <span>0.50</span>
              </div>
            </div>
            <div className="mt-2 text-cyan-400 text-right">{bbWeight.toFixed(2)}g</div>
          </div>

          {mode === 'fps' ? <div>
              <Label className="text-gray-300">Vitesse de balle (FPS)</Label>
              <div className="mt-2">
                <Slider value={[fps]} min={0} max={750} step={1} onValueChange={value => setFps(value[0])} className="py-4" />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>0</span>
                  <span>750</span>
                </div>
              </div>
              <div className="mt-2 text-cyan-400 text-right">{fps} fps</div>
            </div> : <div>
              <Label className="text-gray-300">Énergie cinétique de la bille (Joules)</Label>
              <div className="mt-2">
                <Slider value={[joules * 100]} min={0} max={400} step={1} onValueChange={value => setJoules(value[0] / 100)} className="py-4" />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>0.00</span>
                  <span>4.00</span>
                </div>
              </div>
              <div className="mt-2 text-cyan-400 text-right">{joules.toFixed(2)}J</div>
            </div>}
        </div>

        <Separator className="my-4" />

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300">CQB</span>
            <span className="text-cyan-400">{joules.toFixed(2)}J</span>
          </div>
          <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full transition-all ${getCQBStatus(joules)}`} style={{
            width: `${Math.min(joules / 4 * 100, 100)}%`
          }} />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Vitesse par poids de bille:</Label>
          {commonBBWeights.map(weight => <div key={weight} className="flex justify-between bg-gray-800 p-2 rounded">
              <span>{weight}g</span>
              <span>{Math.round(calculateJoulesToFps(joules, weight))} fps</span>
            </div>)}
        </div>
      </CardContent>
    </Card>;
};
export default FpsJouleCalculator;