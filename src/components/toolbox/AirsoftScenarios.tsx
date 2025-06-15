
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Target, Clock, Users, Loader2, AlertCircle, PlusCircle } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { useScenarios, Scenario } from '@/hooks/useScenarios';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import ScenarioAdminDialog from './ScenarioAdminDialog';

const ScenarioCard = ({ scenario }: { scenario: Scenario }) => (
  <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
    <h3 className="font-semibold text-lg mb-2 text-airsoft-red">{scenario.title}</h3>
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">{scenario.description}</p>
      <div className="flex gap-2 flex-wrap">
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {scenario.duration}
        </span>
        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-center gap-1">
          <Users className="h-3 w-3" />
          {scenario.players} joueurs
        </span>
      </div>
      <ul className="text-sm list-disc list-inside mt-2 space-y-1">
        {scenario.rules.map((rule, ruleIndex) => (
          <li key={ruleIndex} className="text-gray-700">{rule}</li>
        ))}
      </ul>
    </div>
  </div>
);

const AirsoftScenarios = () => {
  const { data: scenarios, isLoading, error } = useScenarios();
  const { user } = useAuth();
  const isAdmin = user?.Admin;
  const [showAdminDialog, setShowAdminDialog] = useState(false);

  const { shortScenarios, longScenarios } = useMemo(() => {
    if (!scenarios) {
      return { shortScenarios: [], longScenarios: [] };
    }
    return {
      shortScenarios: scenarios.filter(s => s.type === 'short'),
      longScenarios: scenarios.filter(s => s.type === 'long'),
    };
  }, [scenarios]);

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div className='flex-grow'>
                <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-airsoft-red" />
                Scénarios de jeu
                </CardTitle>
                <CardDescription>
                Découvrez différents scénarios pour vos parties d'airsoft
                </CardDescription>
            </div>
            {isAdmin && (
                <Button size="sm" onClick={() => setShowAdminDialog(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Gérer les scénarios
                </Button>
            )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-airsoft-red" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>
                Impossible de charger les scénarios. Veuillez réessayer plus tard.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Scénarios Courts</h2>
                  <span className="text-sm text-muted-foreground">(10 min - 1h)</span>
                </div>
                <div className="grid gap-4">
                  {shortScenarios.map((scenario) => (
                    <ScenarioCard key={scenario.id} scenario={scenario} />
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-orange-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Scénarios Longs</h2>
                  <span className="text-sm text-muted-foreground">(2h+)</span>
                </div>
                <div className="grid gap-4">
                  {longScenarios.map((scenario) => (
                    <ScenarioCard key={scenario.id} scenario={scenario} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
    {isAdmin && <ScenarioAdminDialog open={showAdminDialog} onOpenChange={setShowAdminDialog} />}
    </>
  );
};

export default AirsoftScenarios;
