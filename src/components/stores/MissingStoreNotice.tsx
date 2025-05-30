
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
      "PHOTOS À JOINDRE :\n" +
      "Merci de joindre jusqu'à 5 photos de votre magasin :\n" +
      "- 1 logo du magasin\n" +
      "- 1 photo de la devanture/façade\n" +
      "- 3 photos de l'intérieur du magasin (rayons, produits, espace de vente)\n\n" +
      "Ces photos nous aideront à mieux présenter votre magasin sur notre plateforme.\n\n" +
      "Merci pour votre contribution !\n\nCordialement"
    );
    window.open(`mailto:support@airsoft-companion.com?subject=${subject}&body=${body}`);
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
              vous pouvez nous contacter pour demander son ajout. N'oubliez pas de joindre 
              des photos (logo, devanture, intérieur) pour une meilleure présentation.
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
