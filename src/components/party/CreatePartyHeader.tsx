
import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy } from 'lucide-react';

interface CreatePartyHeaderProps {
  shouldShowCopyButton: boolean;
  fillFromLastGame: () => Promise<void>;
  isLoadingImages: boolean;
}

const CreatePartyHeader = ({ shouldShowCopyButton, fillFromLastGame, isLoadingImages }: CreatePartyHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Créer une partie d'airsoft</h1>
          <p className="text-gray-600">Remplissez le formulaire ci-dessous pour organiser votre partie d'airsoft</p>
        </div>
        {shouldShowCopyButton && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={fillFromLastGame}
            disabled={isLoadingImages}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            {isLoadingImages ? "Copie en cours..." : "Copier ma dernière partie"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreatePartyHeader;
