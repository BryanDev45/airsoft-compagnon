
import React from 'react';
import { Mail, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MissingStoreNotice: React.FC = () => {
  const handleContactTeam = () => {
    const subject = encodeURIComponent("Demande d'ajout d'un magasin d'airsoft");
    const body = encodeURIComponent(
      "Bonjour,\n\nJe souhaiterais signaler un magasin d'airsoft qui n'apparaît pas sur votre carte :\n\n" +
      "Nom du magasin : \n" +
      "Adresse complète : \n" +
      "Site web (si disponible) : \n" +
      "Téléphone (si disponible) : \n" +
      "Email (si disponible) : \n\n" +
      "Merci pour votre travail !\n\nCordialement"
    );
    window.open(`mailto:contact@airsoftcommunity.fr?subject=${subject}&body=${body}`);
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Plus className="h-5 w-5 text-blue-600 mt-0.5" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-blue-900 mb-2">
              Votre magasin n'apparaît pas sur la carte ?
            </h4>
            <p className="text-sm text-blue-700 mb-3">
              Si vous connaissez un magasin d'airsoft qui n'est pas référencé sur notre carte, 
              vous pouvez nous contacter pour demander son ajout.
            </p>
            <Button 
              onClick={handleContactTeam}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Mail className="h-4 w-4 mr-2" />
              Signaler un magasin manquant
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissingStoreNotice;
