
import React from 'react';
import { Switch } from "@/components/ui/switch";

interface TeamAssociationToggleProps {
  isAssociation: boolean;
  handleToggleAssociation: () => Promise<void>;
  loading: boolean;
}

const TeamAssociationToggle = ({
  isAssociation,
  handleToggleAssociation,
  loading
}: TeamAssociationToggleProps) => {
  return (
    <div className="pt-4 border-t">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Association déclarée</h3>
          <p className="text-sm text-gray-500">
            Indiquer si votre équipe est une association loi 1901 déclarée
          </p>
        </div>
        
        <div className="flex items-center">
          <Switch 
            checked={isAssociation} 
            onCheckedChange={handleToggleAssociation}
            disabled={loading}
          />
          <span className="ml-2 text-sm font-medium">
            {isAssociation ? "Oui" : "Non"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeamAssociationToggle;
