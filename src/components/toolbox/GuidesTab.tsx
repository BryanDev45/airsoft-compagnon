
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Ruler } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const GuidesTab = () => {
  const openGuide = (guideType: string) => {
    toast({
      title: "Guide en cours de chargement",
      description: `Le guide sur ${guideType} sera bientôt disponible`
    });
  };

  return (
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
  );
};

export default GuidesTab;
