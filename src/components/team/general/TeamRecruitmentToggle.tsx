
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { LockOpen, Lock } from "lucide-react";

interface TeamRecruitmentToggleProps {
  isRecruitmentOpen: boolean;
  handleToggleRecruitment: () => Promise<void>;
  loading: boolean;
}

const TeamRecruitmentToggle = ({
  isRecruitmentOpen,
  handleToggleRecruitment,
  loading
}: TeamRecruitmentToggleProps) => {
  return (
    <div className="pt-4 border-t">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Statut du recrutement</h3>
          <p className="text-sm text-gray-500">
            Autorisez de nouveaux membres à rejoindre votre équipe
          </p>
        </div>
        
        <div className="flex items-center">
          <Switch 
            checked={isRecruitmentOpen} 
            onCheckedChange={handleToggleRecruitment}
            disabled={loading}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-2"
            onClick={handleToggleRecruitment}
            disabled={loading}
          >
            {isRecruitmentOpen ? (
              <>
                <Lock className="h-4 w-4 mr-1" />
                Fermer
              </>
            ) : (
              <>
                <LockOpen className="h-4 w-4 mr-1" />
                Ouvrir
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamRecruitmentToggle;
