
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CreatePartyActionsProps {
  isSubmitting: boolean;
}

const CreatePartyActions = ({ isSubmitting }: CreatePartyActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={() => navigate('/parties')}>
        Annuler
      </Button>
      <Button type="submit" className="bg-airsoft-red hover:bg-red-700" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="animate-spin mr-2">⊙</span>
            Création en cours...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Créer la partie
          </>
        )}
      </Button>
    </div>
  );
};

export default CreatePartyActions;
